import { Globe, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-6 px-8 mt-auto flex flex-col xl:flex-row items-center justify-between gap-6 text-sm z-10 relative">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <span className="font-semibold text-slate-800 dark:text-white">© 2026 TaskNova</span>
        <div className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
          <Globe size={16} />
          <span>English</span>
        </div>
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
          <Phone size={14} />
          <span>+91 6265641092</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
          <svg className="w-4 h-4 fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900 dark:group-hover:fill-white" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.6 318.1 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
          <svg className="w-4 h-4 fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900 dark:group-hover:fill-white" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
          <svg className="w-4 h-4 fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900 dark:group-hover:fill-white" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
          <svg className="w-4 h-4 fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900 dark:group-hover:fill-white" viewBox="0 0 320 512"><path d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"/></svg>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
          <svg className="w-4 h-4 fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900 dark:group-hover:fill-white" viewBox="0 0 576 512"><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors">Terms & Privacy</span>
        <div className="flex gap-3">
          <div className="bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors px-4 py-2 rounded-lg border border-slate-700 flex items-center cursor-pointer shadow-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 fill-white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-300">Download on the</span>
              <span className="text-sm font-semibold text-white">App Store</span>
            </div>
          </div>
          <div className="bg-slate-900 dark:bg-black hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors px-4 py-2 rounded-lg border border-slate-700 flex items-center cursor-pointer shadow-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-white"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-300">GET IT ON</span>
              <span className="text-sm font-semibold text-white">Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
