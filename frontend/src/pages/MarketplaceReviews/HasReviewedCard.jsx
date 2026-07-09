import Button from "../../components/common/Button";
import { ShieldCheckIcon, ArrowDownIcon } from "../../components/common/Icons";

const HasReviewedCard = () => {
  return (
    <div className="w-full lg:w-[560px] h-auto lg:h-[470px] py-12 lg:py-0 relative bg-white/10 rounded-3xl flex flex-col justify-center items-center shadow-[0px_8px_32px_0px_rgba(31,38,135,0.37)] outline outline-1 outline-offset-[-1px] outline-white/20">
      <div className="w-full max-w-96 flex flex-col justify-center items-center px-4">
        <div className="w-16 h-20 pb-6 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-blue-600/10 rounded-full inline-flex justify-center items-center">
            <div className="text-blue-500">
              <ShieldCheckIcon />
            </div>
          </div>
        </div>
        <div className="pb-3 flex flex-col justify-center items-center">
          <h3 className="text-center justify-center text-white text-xl font-bold font-inter leading-5 m-0">
            You've shared your thoughts!
          </h3>
        </div>
        <div className="w-full max-w-96 px-1.5 flex flex-col justify-center items-center mb-8">
          <p className="text-center justify-center text-gray-400 text-base font-normal font-inter leading-5 m-0">
            You have already submitted a review for this
            <br className="hidden sm:block" />
            service. You can manage or delete your existing
            <br className="hidden sm:block" />
            review below.
          </p>
        </div>
        <div className="pt-0 flex flex-col justify-center items-center">
          <Button
            variant="link"
            className="text-blue-500 text-sm font-bold font-inter flex items-center gap-2 group !p-0 hover:text-blue-400 transition-colors"
            onClick={() => {
              const el = document.getElementById("own-review");
              if (el)
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            Go to your review
            <ArrowDownIcon className="group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HasReviewedCard;
