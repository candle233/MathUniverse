'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MathNode } from '@/types/math';
import { getIsAdminMode, setIsAdminMode, updateSingleMathNode } from '@/lib/customPageEngine';
import InSituNodeEditorModal from '@/components/admin/InSituNodeEditorModal';
import {
  ShieldCheck,
  Edit3,
  Copy,
  Settings,
  X,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface AdminFloatingToolbarProps {
  currentNode?: MathNode;
  onNodeUpdated?: (updatedNode: MathNode) => void;
}

export default function AdminFloatingToolbar({
  currentNode,
  onNodeUpdated,
}: AdminFloatingToolbarProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsAdmin(getIsAdminMode());
    const handleAdminUpdate = () => setIsAdmin(getIsAdminMode());
    window.addEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
    return () => window.removeEventListener('mathuniverse:admin-role-updated', handleAdminUpdate);
  }, []);

  if (!isAdmin) return null;

  const handleCloneNode = () => {
    if (!currentNode) return;
    const clonedId = `${currentNode.id}-clone-${Date.now().toString().slice(-4)}`;
    const clonedSlug = `${currentNode.slug}-clone`;
    const clonedNode: MathNode = {
      ...currentNode,
      id: clonedId,
      slug: clonedSlug,
      titleZh: `${currentNode.titleZh} (副本)`,
      titleEn: `${currentNode.titleEn} (Copy)`,
      viewCount: 1,
      reputationScore: 100,
    };
    updateSingleMathNode(clonedNode);
    router.push(`/node/${clonedSlug}`);
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    setIsAdmin(false);
  };

  return (
    <>
      <aside aria-label="管理员快捷操作工具栏" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-900/95 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/20 backdrop-blur-xl animate-fade-in text-xs font-mono">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">管理员模式</span>
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5">
              {currentNode && (
                <>
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                    title="在当前页面直接修改本命题公式与文字"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>在线快捷修改</span>
                  </button>

                  <button
                    onClick={handleCloneNode}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="以当前节点为基础快速克隆新节点"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">克隆为新词条</span>
                  </button>
                </>
              )}

              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 font-bold transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>进入管理后台</span>
              </Link>

              <button
                onClick={handleExitAdmin}
                className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="退出管理员模式"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isCollapsed ? '展开工具栏' : '收起工具栏'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>

      {/* In-Situ Node Editor Modal */}
      {currentNode && isEditorOpen && (
        <InSituNodeEditorModal
          node={currentNode}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSaveSuccess={(updated) => {
            if (onNodeUpdated) {
              onNodeUpdated(updated);
            }
          }}
        />
      )}
    </>
  );
}
