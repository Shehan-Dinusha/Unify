import Overlay from "../../components/common/Overlay";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatusIcon from "../../components/common/StatusIcon";
import { CheckIcon } from "../../components/common/Icons";

const ReviewSubmittedModal = ({ onClose }) => {
  return (
    <Overlay open={true} onClose={onClose}>
      <Card
        variant="modal" padding="p-0"
        className="animate-in fade-in zoom-in duration-200"
      >
        <div className="p-8 pb-6 flex flex-col items-center text-center">
          <StatusIcon variant="success" size="lg" icon={<CheckIcon className="w-8 h-8 text-state-success" />} />

          <h2 className="text-xl font-bold text-white mb-3">
            Review Submitted
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed mb-4">
            Your review has been successfully submitted.
          </div>
        </div>

        <div className="p-6 pt-2 w-full">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
            className="h-11 shadow-lg shadow-primary-blue/20 font-semibold"
          >
            Done
          </Button>
        </div>
      </Card>
    </Overlay>
  );
};

export default ReviewSubmittedModal;
