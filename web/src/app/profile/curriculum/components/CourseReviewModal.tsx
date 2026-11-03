import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface CourseReviewModalProps {
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  selectedReviewCourse: any;
  setSelectedReviewCourse: (c: any) => void;
  isReviewReadOnly: boolean;
  courseFeedbacks: Record<number, any>;
  setCourseFeedbacks: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  submittingReview: boolean;
  setSubmittingReview: (submitting: boolean) => void;
  dbService: any;
  t: any;
  lang: string;
  getLocalizedTitle: (c: any) => string;
}

export const CourseReviewModal: React.FC<CourseReviewModalProps> = ({
  showReviewModal,
  setShowReviewModal,
  selectedReviewCourse,
  setSelectedReviewCourse,
  isReviewReadOnly,
  courseFeedbacks,
  setCourseFeedbacks,
  submittingReview,
  setSubmittingReview,
  dbService,
  t,
  lang,
  getLocalizedTitle
}) => {
  return (
      <AnimatePresence>
        {showReviewModal && selectedReviewCourse && (() => {
          const courseId = selectedReviewCourse.id.toString();
          const isReviewed = isReviewReadOnly;
          const fb = courseFeedbacks[selectedReviewCourse.id] || { rating: 0, comment: '' };
          
          // Local states inside the popup to allow interactive inputs
          const [localRating, setLocalRating] = useState(fb.rating || 0);
          const [localHoverRating, setLocalHoverRating] = useState(0);
          const [localComment, setLocalComment] = useState(fb.comment || '');
          const [localSubmitted, setLocalSubmitted] = useState(false);

          const handleLocalSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (localRating === 0) return;

            setSubmittingReview(true);
            try {
              await dbService.addCourseFeedback({
                courseId,
                rating: localRating,
                comment: localComment
              });

              // Update the courseFeedbacks map state in CurriculumPage
              setCourseFeedbacks(prev => ({
                ...prev,
                [selectedReviewCourse.id]: { rating: localRating, comment: localComment }
              }));
              
              setLocalSubmitted(true);
              setIsReviewReadOnly(true);
              setTimeout(() => {
                setShowReviewModal(false);
                setSelectedReviewCourse(null);
              }, 1800);
            } catch (err) {
              console.error("Error submitting review:", err);
            } finally {
              setSubmittingReview(false);
            }
          };

          return (
            <div 
              onClick={() => {
                setShowReviewModal(false);
                setSelectedReviewCourse(null);
              }} 
              className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden cursor-default"
              >
                {/* Background ambient light */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header ribbon if completed */}
                {isReviewed && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600/10 text-emerald-400 border-l border-b border-emerald-500/20 rounded-bl-2xl text-[8px] font-black uppercase tracking-wider select-none animate-pulse">
                    {REVIEWED_READ_ONLY_LABEL[upperLang] || REVIEWED_READ_ONLY_LABEL.EN}
                  </div>
                )}

                {/* Close Button X */}
                <button 
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReviewCourse(null);
                  }}
                  className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-white rounded-xl cursor-pointer transition-colors"
                  title={CLOSE_LABEL[upperLang] || CLOSE_LABEL.EN}
                >
                  <Icons.X className="w-4 h-4" />
                </button>

                {/* Modal Title */}
                <div className="flex items-center gap-4 text-emerald-500 mb-6 mr-8">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Star className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 block mb-1">
                      {isReviewed 
                        ? (YOUR_SAVED_REVIEW_LABEL[upperLang] || YOUR_SAVED_REVIEW_LABEL.EN) 
                        : (SHARE_YOUR_EXPERIENCE_LABEL[upperLang] || SHARE_YOUR_EXPERIENCE_LABEL.EN)}
                    </span>
                    <h3 className="text-xl font-black text-white leading-tight">
                      {getLocalizedTitle(selectedReviewCourse)}
                    </h3>
                  </div>
                </div>

                {localSubmitted && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-4 text-xs font-semibold flex items-center gap-3 border-l-4 border-l-emerald-500">
                    <Icons.CheckCircle className="w-5 h-5 shrink-0" />
                    <span>
                      {REVIEW_SAVED_LABEL[upperLang] || REVIEW_SAVED_LABEL.EN}
                    </span>
                  </div>
                )}

                <form onSubmit={handleLocalSubmit} className="space-y-6">
                  {/* Rating container with blurred/read-only mode */}
                  <div className={isReviewed ? "pointer-events-none opacity-70 filter blur-[0.4px] select-none space-y-6" : "space-y-6"}>
                    {/* Stars Selection */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {RATE_THIS_COURSE_LABEL[upperLang] || RATE_THIS_COURSE_LABEL.EN} {!isReviewed && <span className="text-red-500">*</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            disabled={isReviewed}
                            onClick={() => setLocalRating(star)}
                            onMouseEnter={() => !isReviewed && setLocalHoverRating(star)}
                            onMouseLeave={() => !isReviewed && setLocalHoverRating(0)}
                            className={`p-1 transition-transform outline-none ${isReviewed ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
                          >
                            <Star 
                              className={`w-8 h-8 transition-colors ${
                                star <= (localHoverRating || localRating) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {COMMENTS_SUGGESTIONS_LABEL[upperLang] || COMMENTS_SUGGESTIONS_LABEL.EN}
                      </span>
                      <textarea
                        value={localComment}
                        onChange={(e) => setLocalComment(e.target.value)}
                        disabled={isReviewed}
                        placeholder={TEXTAREA_PLACEHOLDER_LABEL[upperLang] || TEXTAREA_PLACEHOLDER_LABEL.EN}
                        rows={4}
                        className={`w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none transition-all font-medium leading-relaxed ${isReviewed ? 'opacity-50 cursor-not-allowed border-slate-900' : 'focus:border-emerald-500/50'}`}
                      />
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-4 pt-4 border-t border-slate-800/50">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReviewCourse(null);
                      }}
                      className="flex-1 py-4 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                    >
                      {CLOSE_LABEL[upperLang] || CLOSE_LABEL.EN}
                    </button>
                    {!isReviewed && (
                      <button
                        type="submit"
                        disabled={localRating === 0 || submittingReview}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl ${
                          localRating > 0 && !submittingReview
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 cursor-pointer active:scale-95' 
                            : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {SUBMIT_REVIEW_LABEL[upperLang] || SUBMIT_REVIEW_LABEL.EN}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

  );
};
