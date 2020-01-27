import notificationsActions from './notifications';
import sessionsActions from './session';

export const { newNotification } = notificationsActions;
export const { closeNotification } = notificationsActions;
export const { updateConnectionStatus } = sessionsActions;
export const { updatePageStatus } = sessionsActions;
