import React, { useState } from 'react';
import { DonationRecord, UserProfile } from '../types';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  User, 
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donations: DonationRecord[];
  onApproveDonation: (donationId: string) => void;
  onRejectDonation: (donationId: string, reason?: string) => void;
  onViewReceipt: (donation: DonationRecord) => void;
}

export const AdminApprovalsModal: React.FC<AdminApprovalsModalProps> = ({
  isOpen,
  onClose,
  donations,
  onApproveDonation,
  onRejectDonation,
  onViewReceipt
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('PAN verification details required');

  if (!isOpen) return null;

  const pendingCount = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending').length;
  const approvedCount = donations.filter(d => d.approvalStatus === 'approved').length;
  const rejectedCount = donations.filter(d => d.approvalStatus === 'rejected').length;

  const filteredDonations = donations.filter(d => {
    // Filter by status tab
    const status = d.approvalStatus || 'pending';
    if (filter !== 'all' && status !== filter) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.donorName?.toLowerCase().includes(q) || false;
      const matchEmail = d.donorEmail?.toLowerCase().includes(q) || false;
      const matchPan = d.donorTaxId?.toLowerCase().includes(q) || false;
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchReceipt = d.receiptNumber.toLowerCase().includes(q);
      const matchId = d.id.toLowerCase().includes(q);
      return matchName || matchEmail || matchPan || matchTitle || matchReceipt || matchId;
    }

    return true;
  });

  const handleApproveAllPending = () => {
    const pendingList = donations.filter(d => !d.approvalStatus || d.approvalStatus === 'pending');
    pendingList.forEach(d => {
      onApproveDonation(d.id);
    });
  };

  const handleConfirmReject = (id: string) => {
    onRejectDonation(id, rejectReason);
    setRejectingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-[2.2rem] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 text-white flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight">
                  80G Tax Exemption & Badge Approvals
                </h2>
                {pendingCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                    {pendingCount} PENDING
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">
                Verify donor donations to issue official 80G exemption receipts and unlock impact badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Summary Bar */}
        <div className="grid grid-cols-3 p-3 bg-gray-50 border-b border-gray-200 text-center gap-2">
          <div className="p-2 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Action</div>
            <div className="text-base font-black text-amber-900">{pendingCount}</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Approved & Sealed</div>
            <div className="text-base font-black text-emerald-900">{approvedCount}</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Recorded</div>
            <div className="text-base font-black text-gray-900">{donations.length}</div>
          </div>
        </div>

        {/* Controls Bar: Filter Tabs + Search + Batch Approve */}
        <div className="p-3.5 border-b border-gray-200 space-y-2.5 bg-white">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'pending'
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'rejected'
                    ? 'bg-rose-600 text-white shadow-xs font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white shadow-xs font-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({donations.length})
              </button>
            </div>

            {/* Batch Approve Pending Button */}
            {pendingCount > 0 && filter === 'pending' && (
              <button
                onClick={handleApproveAllPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve All Pending ({pendingCount})</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Donor Name, Email, PAN number, Receipt No..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        {/* Donations Approval List */}
        <div className="p-4 space-y-3 flex-1">
          {filteredDonations.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {filter === 'pending' ? 'No Pending Approvals' : 'No Donation Records Found'}
              </h4>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                {filter === 'pending'
                  ? 'All donor contributions have been reviewed and verified with official 80G tax exemption seals.'
                  : 'Try adjusting your search criteria or filter tab.'}
              </p>
            </div>
          ) : (
            filteredDonations.map((donation) => {
              const status = donation.approvalStatus || 'pending';
              const isPending = status === 'pending';
              const isApproved = status === 'approved';
              const isRejected = status === 'rejected';

              return (
                <div
                  key={donation.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                      : isApproved
                      ? 'bg-white border-gray-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    {/* Donor & Donation Info */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {donation.id}
                        </span>
                        <h4 className="font-extrabold text-xs text-gray-900">
                          {donation.donorName || 'Generous Supporter'}
                        </h4>
                        <span className="text-[11px] text-gray-500">
                          ({donation.donorEmail || 'email not provided'})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-gray-400 font-medium block text-[9px] uppercase tracking-wider">Amount</span>
                          <span className="font-black text-orange-600 text-xs">
                            ₹{(donation.amount ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block text-[9px] uppercase tracking-wider">Tax ID / PAN</span>
                          <span className="font-mono font-bold text-gray-800">
                            {donation.donorTaxId || 'PAN-PENDING'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block text-[9px] uppercase tracking-wider">Initiative</span>
                          <span className="font-semibold text-gray-800 line-clamp-1">
                            {donation.title}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium block text-[9px] uppercase tracking-wider">Payment Mode</span>
                          <span className="text-gray-700 line-clamp-1">
                            {donation.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Approval Status details */}
                      <div className="pt-1.5 flex items-center gap-2 text-[10px]">
                        {isPending ? (
                          <span className="flex items-center gap-1 font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>80G Receipt & Badge: Awaiting Approval</span>
                          </span>
                        ) : isApproved ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved by {donation.approvedBy || 'Trustee'} on {donation.approvedAt || donation.date}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected: {donation.rejectionReason || 'Verification issue'}</span>
                          </span>
                        )}
                        <span className="text-gray-400 font-mono">• {donation.date}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-1.5 flex-shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
                      <button
                        onClick={() => onViewReceipt(donation)}
                        className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                        title="Preview Receipt"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>

                      {isPending && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onApproveDonation(donation.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-all"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Approve 80G</span>
                          </button>
                          <button
                            onClick={() => setRejectingId(donation.id)}
                            className="px-2 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => setRejectingId(donation.id)}
                          className="text-[10px] text-gray-400 hover:text-rose-600 underline transition-colors"
                        >
                          Revoke Approval
                        </button>
                      )}

                      {isRejected && (
                        <button
                          onClick={() => onApproveDonation(donation.id)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Re-Approve</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reject Reason Sub-form */}
                  {rejectingId === donation.id && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900 text-[11px]">Reason for 80G Rejection:</span>
                        <button onClick={() => setRejectingId(null)} className="text-gray-400 hover:text-gray-700 text-xs">Cancel</button>
                      </div>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Invalid PAN or missing government KYC"
                        className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs font-medium"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleConfirmReject(donation.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Approvals instantly unlock 80G certificates & milestone badges for donors</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
