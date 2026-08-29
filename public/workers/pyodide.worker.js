/**
 * MathUniverse Pyodide & SymPy Web Worker
 * Runs Python 3.11+ / WebAssembly with preloaded SymPy & NumPy in a dedicated Web Worker.
 */

/* eslint-disable no-restricted-globals */

let pyodideInstance = null;
let isLoading = false;
let isReady = false;

const PYODIDE_CDN_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

async function initPyodideRuntime(packages = ['sympy', 'numpy']) {
  if (isReady && pyodideInstance) {
    self.postMessage({
      type: 'READY',
      version: 'v0.26.4',
      loadedPackages: packages,
    });
    return;
  }

  if (isLoading) return;
  isLoading = true;

  try {
    self.postMessage({
      type: 'STATUS',
      state: 'loading',
      message: '正在从 CDN 加载 Pyodide WebAssembly 运行时 (0.26.4)...',
      progress: 20,
    });

    // Import Pyodide script
    importScripts(`${PYODIDE_CDN_BASE}pyodide.js`);

    self.postMessage({
      type: 'STATUS',
      state: 'loading',
      message: '初始化 Python 虚拟机环境...',
      progress: 50,
    });

    // @ts-ignore
    pyodideInstance = await loadPyodide({
      indexURL: PYODIDE_CDN_BASE,
    });

    self.postMessage({
      type: 'STATUS',
      state: 'installing',
      message: '预热数学库 (SymPy 符号代数 & NumPy 矩阵运算)...',
      progress: 75,
    });

    // Preload SymPy and NumPy
    if (packages && packages.length > 0) {
      await pyodideInstance.loadPackage(packages);
    }

    // Set up standard environment
    await pyodideInstance.runPythonAsync(`
import sys
import io
import json

# Setup standard imports
try:
    import sympy as sp
    import numpy as np
except Exception as e:
    pass

def _format_latex_safe(obj):
    try:
        import sympy as sp
        if isinstance(obj, sp.Basic):
            return sp.latex(obj)
    except:
        pass
    return str(obj)
`);

    isReady = true;
    isLoading = false;

    self.postMessage({
      type: 'STATUS',
      state: 'ready',
      message: 'Pyodide + SymPy 就绪 (0ms 交互延迟)',
      progress: 100,
    });

    self.postMessage({
      type: 'READY',
      version: 'v0.26.4',
      loadedPackages: packages,
    });
  } catch (error) {
    isLoading = false;
    isReady = false;
    self.postMessage({
      type: 'STATUS',
      state: 'error',
      message: `Pyodide 加载失败: ${error.message || error}`,
    });
  }
}

async function runPythonCode(payload) {
  const { runId, code, params = {} } = payload;

  if (!isReady || !pyodideInstance) {
    self.postMessage({
      type: 'EXECUTION_ERROR',
      runId,
      errorType: 'RuntimeNotReady',
      errorMessage: 'Pyodide WebAssembly 运行时尚未就绪，请等待初始化完成。',
    });
    return;
  }

  const startTime = performance.now();

  try {
    // Inject parameters as a Python dictionary
    const paramsJson = JSON.stringify(params);
    await pyodideInstance.runPythonAsync(`
import json
import sys
import io
import sympy as sp
import numpy as np

# Inject params dictionary into global scope
params = json.loads('''${paramsJson}''')
for _k, _v in params.items():
    globals()[_k] = _v

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer
_execution_result = None
_latex_result = None
_plot_payload = None
`);

    // Execute user code
    await pyodideInstance.runPythonAsync(code);

    // Capture output and results
    const results = await pyodideInstance.runPythonAsync(`
sys.stdout = _old_stdout
sys.stderr = _old_stderr

_out_str = _stdout_buffer.getvalue()
_err_str = _stderr_buffer.getvalue()

_res_latex = ""
if '_latex_result' in globals() and _latex_result is not None:
    _res_latex = str(_latex_result)
elif '_execution_result' in globals() and _execution_result is not None:
    try:
        _res_latex = sp.latex(_execution_result)
    except:
        _res_latex = str(_execution_result)

_plot_data_json = ""
if '_plot_payload' in globals() and _plot_payload is not None:
    try:
        _plot_data_json = json.dumps(_plot_payload)
    except:
        pass

json.dumps({
    "stdout": _out_str,
    "stderr": _err_str,
    "latex": _res_latex,
    "plotJson": _plot_data_json
})
`);

    const endTime = performance.now();
    const parsed = JSON.parse(results);

    let plotPayload = undefined;
    if (parsed.plotJson) {
      try {
        plotPayload = JSON.parse(parsed.plotJson);
      } catch (e) {}
    }

    self.postMessage({
      type: 'EXECUTION_SUCCESS',
      runId,
      stdout: parsed.stdout,
      stderr: parsed.stderr,
      latexResult: parsed.latex || undefined,
      plotPayload,
      executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
    });
  } catch (err) {
    const endTime = performance.now();
    // Restore stdout/stderr
    try {
      await pyodideInstance.runPythonAsync(`
import sys
if '_old_stdout' in globals(): sys.stdout = _old_stdout
if '_old_stderr' in globals(): sys.stderr = _old_stderr
`);
    } catch (e) {}

    self.postMessage({
      type: 'EXECUTION_ERROR',
      runId,
      errorType: err.name || 'PythonExecutionError',
      errorMessage: err.message || String(err),
      traceback: String(err),
    });
  }
}

async function verifyClaim(payload) {
  const { runId, contractId, nodeId, testCode, params = {} } = payload;

  if (!isReady || !pyodideInstance) {
    self.postMessage({
      type: 'VERIFY_RESULT',
      runId,
      contractId,
      nodeId,
      passed: false,
      maxError: 1.0,
      sampleCount: 0,
      details: 'Pyodide 未就绪，无法执行 Python 验证',
      durationMs: 0,
    });
    return;
  }

  const startTime = performance.now();

  try {
    const paramsJson = JSON.stringify(params);
    await pyodideInstance.runPythonAsync(`
import json
import sympy as sp
import numpy as np

params = json.loads('''${paramsJson}''')
for _k, _v in params.items():
    globals()[_k] = _v
`);

    const rawResult = await pyodideInstance.runPythonAsync(testCode);
    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;

    let passed = false;
    let maxError = 0;
    let sampleCount = 1;
    let details = '验证执行完毕';

    if (rawResult && typeof rawResult === 'object') {
      try {
        const dict = rawResult.toJs ? rawResult.toJs() : rawResult;
        if (dict instanceof Map) {
          passed = Boolean(dict.get('passed'));
          maxError = Number(dict.get('max_error') || 0);
          sampleCount = Number(dict.get('sample_count') || 1);
          details = String(dict.get('details') || (passed ? 'Python / SymPy 验证通过' : 'Python 验证未通过'));
        } else if (typeof dict === 'object') {
          passed = Boolean(dict.passed);
          maxError = Number(dict.max_error || 0);
          sampleCount = Number(dict.sample_count || 1);
          details = String(dict.details || (passed ? 'Python / SymPy 验证通过' : 'Python 验证未通过'));
        }
      } catch (e) {
        passed = Boolean(rawResult);
      }
    } else if (typeof rawResult === 'boolean') {
      passed = rawResult;
      details = passed ? 'Python / SymPy 断言成立 (True)' : 'Python 断言失败 (False)';
    }

    self.postMessage({
      type: 'VERIFY_RESULT',
      runId,
      contractId,
      nodeId,
      passed,
      maxError,
      sampleCount,
      details,
      durationMs,
    });
  } catch (err) {
    const durationMs = Math.round((performance.now() - startTime) * 10) / 10;
    self.postMessage({
      type: 'VERIFY_RESULT',
      runId,
      contractId,
      nodeId,
      passed: false,
      maxError: 1.0,
      sampleCount: 0,
      details: `Python 验证执行异常: ${err.message || err}`,
      durationMs,
    });
  }
}

self.onmessage = async (event) => {
  const request = event.data;
  if (!request || !request.type) return;

  switch (request.type) {
    case 'INIT':
      await initPyodideRuntime(request.packages);
      break;
    case 'RUN_CODE':
      await runPythonCode(request);
      break;
    case 'VERIFY_CLAIM':
      await verifyClaim(request);
      break;
    default:
      break;
  }
};
