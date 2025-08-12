import './HelpDialog.scss';
import { Alert } from 'antd';

const HelpDialog = (
  {
    type="info", 
    message="Queue system is designed to simplify the agent's control over the created bookings and to inform the agency's staff about emerging events.Queuing of an order implies its further processing by the agent."
  } :{
    type: "info" | "success" | "error" | "warning",
    message: string
  }
) => {
  return (
    <Alert
      message = {message}
      data-testid = "HelpDialog"
      type = {type}
      closable
    />
  );
};

export default HelpDialog;
