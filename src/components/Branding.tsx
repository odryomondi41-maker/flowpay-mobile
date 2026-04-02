import { BRANDING } from '../constants/branding';

export const Branding = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-200">
        <img 
          src={BRANDING.LOGO_PATH} 
          alt={BRANDING.APP_NAME} 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-xl font-black text-slate-900 leading-none">{BRANDING.APP_NAME}</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">By {BRANDING.DEVELOPER}</p>
      </div>
    </div>
  );
};