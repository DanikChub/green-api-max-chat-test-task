

export interface GreenApiCredentials {
    apiUrl: string;
    idInstance: string;
    apiTokenInstance: string;
}

export type InstanceState =
    | 'authorized'
    | 'notAuthorized'
    | 'blocked'
    | 'starting';

export interface GetStateInstanceResponse {
    stateInstance: InstanceState;
}

export interface CheckAccountResponse {
    exist: boolean;
    chatId: string;
    fromCache: boolean;
}

export interface SendMessageResponse {
    idMessage: string;
}

export interface ReceiveNotificationResponse {
    receiptId: number;
    body: {
        typeWebhook: string;
        timestamp?: number;
        senderData?: {
            chatId?: string;
            sender?: string;
            senderName?: string;
        };
        messageData?: {
            typeMessage?: string;
            textMessageData?: {
                textMessage?: string;
            };
        };
    };
}

export interface ChatMessage {
    id: string;
    text: string;
    direction: 'incoming' | 'outgoing';
}