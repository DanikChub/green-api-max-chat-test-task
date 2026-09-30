import {
    type FormEvent,
    useCallback,
    useState,
} from 'react';

import { useNotifications } from '../../hooks/useNotifications';

import './Chat.css';

import type {
    ChatMessage,
    GreenApiCredentials,
} from '../../types/greenApi';
interface ChatProps {
    credentials: GreenApiCredentials;
    onLogout: () => void;
}

import { checkAccount, sendMessage } from '../../api/greenApi';

export function Chat({
                         credentials,
                         onLogout,
                     }: ChatProps) {
    const [phone, setPhone] = useState('');
    const [activePhone, setActivePhone] = useState<string | null>(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);

    const [activeChatId, setActiveChatId] =
        useState<string | null>(null);

    const [isCreatingChat, setIsCreatingChat] =
        useState(false);

    const [error, setError] = useState('');


    const handleIncomingMessage = useCallback(
        (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        },
        [],
    );

    useNotifications({
        credentials,
        activeChatId,
        onMessage: handleIncomingMessage,
    });

    const handleCreateChat = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const normalizedPhone = phone.replace(/\D/g, '');

        if (!normalizedPhone) {
            return;
        }

        try {
            setIsCreatingChat(true);
            setError('');

            const result = await checkAccount(
                credentials,
                normalizedPhone,
            );

            if (!result.exist) {
                setError('Пользователь с таким номером не найден в MAX');
                return;
            }

            setMessages([]);
            setActivePhone(normalizedPhone);
            setActiveChatId(result.chatId);
            setPhone('');
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось создать чат',
            );
        } finally {
            setIsCreatingChat(false);
        }
    };

    const handleSendMessage = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const text = message.trim();

        if (!text || !activeChatId) {
            return;
        }

        try {
            setIsSending(true);
            setError('');

            const result = await sendMessage(
                credentials,
                activeChatId,
                text,
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: result.idMessage,
                    text,
                    direction: 'outgoing',
                },
            ]);
            setMessage('');
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось отправить сообщение',
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="chat">
            <aside className="chat__sidebar">
                <div className="chat__sidebar-header">
                    <div>
                        <h1>MAX</h1>
                        <span>GREEN-API</span>
                    </div>

                    <button
                        className="chat__logout"
                        type="button"
                        onClick={onLogout}
                    >
                        Выйти
                    </button>
                </div>

                <form
                    className="chat__new-chat"
                    onSubmit={handleCreateChat}
                >
                    <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="Номер телефона"
                    />

                    <button
                        type="submit"
                        disabled={!phone.trim() || isCreatingChat}
                    >
                        {isCreatingChat ? 'Проверка...' : 'Создать чат'}
                    </button>
                </form>

                {error && (
                    <div className="chat__error">
                        {error}
                    </div>
                )}

                <div className="chat__list">
                    {activePhone && (
                        <button className="chat__contact" type="button">
                            <div className="chat__avatar">
                                {activePhone.slice(-2)}
                            </div>

                            <div className="chat__contact-info">
                                <strong>+{activePhone}</strong>
                                <span>Новый чат</span>
                            </div>
                        </button>
                    )}
                </div>
            </aside>

            <section className="chat__content">
                {activePhone ? (
                    <>
                        <header className="chat__header">
                            <div className="chat__avatar">
                                {activePhone.slice(-2)}
                            </div>

                            <strong>+{activePhone}</strong>
                        </header>

                        <div className="chat__messages">
                            {messages.length === 0 ? (
                                <div className="chat__empty">
                                    Начните общение
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        className={`chat__message chat__message--${message.direction}`}
                                        key={message.id}
                                    >
                                        {message.text}
                                    </div>
                                ))
                            )}
                        </div>

                        <form
                            className="chat__composer"
                            onSubmit={handleSendMessage}
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Сообщение"
                                disabled={isSending}
                            />

                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    !activeChatId ||
                                    isSending
                                }
                            >
                                {isSending ? '...' : 'Отправить'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat__placeholder">
                        <h2>MAX Chat</h2>
                        <p>Введите номер телефона, чтобы начать общение</p>
                    </div>
                )}
            </section>
        </div>
    );
}