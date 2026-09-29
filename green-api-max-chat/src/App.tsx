import { useState } from 'react';
import { AuthForm } from './components/AuthForm/AuthForm';
import { Chat } from './components/Chat/Chat';
import { getStateInstance } from './api/greenApi';
import type { GreenApiCredentials } from './types/greenApi';

function App() {
    const [credentials, setCredentials] =
        useState<GreenApiCredentials | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (
        credentials: GreenApiCredentials,
    ) => {
        try {
            setIsLoading(true);
            setError('');

            const { stateInstance } =
                await getStateInstance(credentials);

            if (stateInstance !== 'authorized') {
                setError(
                    `Инстанс не авторизован. Текущий статус: ${stateInstance}`,
                );

                return;
            }

            setCredentials(credentials);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : 'Не удалось подключиться к GREEN-API',
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!credentials) {
        return (
            <AuthForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
            />
        );
    }

    return (
        <Chat
            credentials={credentials}
            onLogout={() => setCredentials(null)}
        />
    );
}

export default App;