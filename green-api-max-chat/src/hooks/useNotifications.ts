import { useEffect } from 'react';
import {
    deleteNotification,
    receiveNotification,
} from '../api/greenApi';
import type {
    ChatMessage,
    GreenApiCredentials,
} from '../types/greenApi';

interface UseNotificationsParams {
    credentials: GreenApiCredentials;
    activeChatId: string | null;
    onMessage: (message: ChatMessage) => void;
}

export function useNotifications({
                                     credentials,
                                     activeChatId,
                                     onMessage,
                                 }: UseNotificationsParams) {
    useEffect(() => {
        if (!activeChatId) {
            return;
        }

        let cancelled = false;

        const poll = async () => {
            while (!cancelled) {
                try {
                    const notification =
                        await receiveNotification(credentials);

                    if (!notification) {
                        continue;
                    }

                    const { receiptId, body } = notification;

                    if (
                        body.typeWebhook === 'incomingMessageReceived' &&
                        body.senderData?.chatId === activeChatId
                    ) {
                        const text =
                            body.messageData?.textMessageData?.textMessage;

                        if (text) {
                            onMessage({
                                id: `incoming-${receiptId}`,
                                text,
                                direction: 'incoming',
                            });
                        }
                    }

                    await deleteNotification(
                        credentials,
                        receiptId,
                    );
                } catch (error) {
                    console.error(
                        'Ошибка получения уведомления:',
                        error,
                    );

                    // Чтобы при ошибке не устроить бесконечный
                    // цикл запросов без задержки.
                    await new Promise((resolve) =>
                        setTimeout(resolve, 2000),
                    );
                }
            }
        };

        void poll();

        return () => {
            cancelled = true;
        };
    }, [credentials, activeChatId, onMessage]);
}