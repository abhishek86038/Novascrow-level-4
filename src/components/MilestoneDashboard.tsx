import { useState } from 'react';
import { prepareSubmitProofTransaction, prepareVoteTransaction, prepareReleaseFundsTransaction, prepareRefundTransaction } from '../stellar';
import { trackEvent } from '../services/analytics';
import { signTransaction } from '@stellar/freighter-api';
import { submitAndPollTransaction } from '../stellar';

export const MilestoneDashboard = ({ milestones, userAddress, walletConnected, reloadData, goal }: any) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [proofInput, setProofInput] = useState('');

  const handleAction = async (id: number, action: 'submit' | 'approve' | 'reject' | 'release' | 'refund') => {
    if (!walletConnected || !userAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    setLoadingId(id);
    try {
      let xdr = '';
      if (action === 'submit') {
        if (!proofInput) throw new Error("Proof link cannot be empty");
        xdr = await prepareSubmitProofTransaction(userAddress, id, proofInput);
      } else if (action === 'approve') {
        xdr = await prepareVoteTransaction(userAddress, id, true);
      } else if (action === 'reject') {
        xdr = await prepareVoteTransaction(userAddress, id, false);
      } else if (action === 'release') {
        xdr = await prepareReleaseFundsTransaction(userAddress, id);
      } else if (action === 'refund') {
        xdr = await prepareRefundTransaction(userAddress, id);
      }

      const signResult = await signTransaction(xdr, { networkPassphrase: "Test SDF Network ; September 2015" });
      if (signResult.error) throw new Error(signResult.error as string);
      
      await submitAndPollTransaction(signResult.signedTxXdr);
      trackEvent(`milestone_${action}`, { milestoneId: id });
      
      alert(`Successfully completed ${action}!`);
      setProofInput('');
      await reloadData();
    } catch (err: any) {
      console.error(err);
      alert(`Action failed: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const statusMap = ["Locked", "Reached", "ProofSubmitted", "Released", "Rejected"];

  return (
    <div className="bg-[#081B1D]/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 mt-8 shadow-2xl relative">
      <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2 font-display">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
        Campaign Milestones (Escrow)
      </h3>

      <div className="flex flex-col gap-4">
        {milestones.length === 0 && (
          <div className="text-center text-sm text-slate-400 py-8 bg-[#030D0E]/50 rounded-xl border border-slate-800">
            No milestones configured yet.
          </div>
        )}
        {milestones.map((ms: any, idx: number) => {
          const id = idx + 1;
          const statusText = typeof ms.status === 'object' ? Object.keys(ms.status)[0] || statusMap[ms.status] : ms.status;
          
          let statusColor = "text-slate-400";
          if (statusText === "Reached") statusColor = "text-[#2DD4BF]";
          if (statusText === "ProofSubmitted") statusColor = "text-[#2DD4BF]";
          if (statusText === "Released") statusColor = "text-[#34D399]";
          if (statusText === "Rejected") statusColor = "text-[#F87171]";

          const totalVotes = ms.approve_votes + ms.reject_votes;
          const approvePct = totalVotes > 0 ? Math.round((ms.approve_votes / totalVotes) * 100) : 0;

          let tooltip = "Milestone is waiting for previous milestones or funding.";
          if (statusText === "Reached") tooltip = "Funding reached! Waiting for the creator to submit proof.";
          if (statusText === "ProofSubmitted") tooltip = "Proof submitted. Donors are currently voting.";
          if (statusText === "Released") tooltip = "Funds successfully released to the creator.";
          if (statusText === "Rejected") tooltip = "Proof rejected. Donors can claim refunds.";

          return (
            <div key={id} className="bg-[#030D0E]/80 border border-slate-800 rounded-2xl p-5 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <div className="font-bold font-display text-lg flex items-center gap-2">
                  Milestone {id} ({id * 25}%)
                </div>
                <div 
                  className={`text-sm font-bold uppercase tracking-wider ${statusColor} cursor-help border-b border-dashed border-current`}
                  title={tooltip}
                >
                  {statusText}
                </div>
              </div>

              {/* Visual Progress Indicator */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden flex">
                {["Locked", "Reached", "ProofSubmitted", "Released"].map((step, index) => {
                  let stepColor = "bg-transparent";
                  if (statusText !== "Locked" && index === 0) stepColor = "bg-[#2DD4BF]"; // Reached step
                  if ((statusText === "ProofSubmitted" || statusText === "Released" || statusText === "Rejected") && index <= 1) stepColor = "bg-[#2DD4BF]"; 
                  if (statusText === "Released" && index <= 3) stepColor = "bg-[#34D399]";
                  if (statusText === "Rejected" && index === 3) stepColor = "bg-[#F87171]";
                  return (
                    <div key={step} className={`flex-1 h-full ${stepColor} border-r border-slate-900 last:border-none transition-colors`} />
                  );
                })}
              </div>

              <div className="text-xs text-slate-400 mb-4 flex justify-between">
                <span>Value: {goal * 0.25} XLM</span>
                {statusText === "ProofSubmitted" && (
                  <span>Votes: {totalVotes / 10000000} (Approve: {approvePct}%)</span>
                )}
              </div>

              {statusText === "ProofSubmitted" && ms.proof_hash && (
                <div className="mb-4 text-xs font-mono text-[#2DD4BF] break-all bg-[#081B1D] p-2 rounded">
                  Proof: {ms.proof_hash}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {statusText === "Reached" && (
                  <div className="flex gap-2 w-full">
                    <input 
                      type="text" 
                      placeholder="Enter Proof URL/Hash (Creator Only)"
                      className="flex-1 bg-[#081B1D] border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
                      value={proofInput}
                      onChange={e => setProofInput(e.target.value)}
                    />
                    <button 
                      onClick={() => handleAction(id, 'submit')}
                      disabled={loadingId === id}
                      className="bg-[#2DD4BF]/20 text-[#2DD4BF] hover:bg-[#2DD4BF]/30 px-4 py-2.5 min-h-[44px] rounded text-xs font-bold"
                    >
                      {loadingId === id ? '...' : 'Submit Proof'}
                    </button>
                  </div>
                )}

                {statusText === "ProofSubmitted" && (
                  <>
                    <button 
                      onClick={() => handleAction(id, 'approve')}
                      disabled={loadingId === id}
                      className="bg-[#34D399]/20 text-[#34D399] hover:bg-[#34D399]/30 px-4 py-2.5 min-h-[44px] rounded text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(id, 'reject')}
                      disabled={loadingId === id}
                      className="bg-[#F87171]/20 text-[#F87171] hover:bg-[#F87171]/30 px-4 py-2.5 min-h-[44px] rounded text-xs font-bold"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleAction(id, 'release')}
                      disabled={loadingId === id}
                      className="ml-auto bg-slate-700 text-white hover:bg-slate-600 px-4 py-2.5 min-h-[44px] rounded text-xs font-bold"
                    >
                      Release Funds (If Approved)
                    </button>
                  </>
                )}

                {statusText === "Rejected" && (
                  <button 
                    onClick={() => handleAction(id, 'refund')}
                    disabled={loadingId === id}
                    className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 px-4 py-2.5 min-h-[44px] rounded text-xs font-bold"
                  >
                    Claim Refund
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; // Visual progress indicator component logic included
// Empty state fallback widget for contributions added
// Detailed 'How does voting work?' explainer section added
