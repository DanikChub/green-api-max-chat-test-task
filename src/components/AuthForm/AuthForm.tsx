import type {GreenApiCredentials} from "../../types/greenApi.ts";
import {type FormEvent, useState} from "react";
import "./AuthForm.css";

interface AuthFormProps {
    onSubmit: (credentials: GreenApiCredentials) => void;
    isLoading: boolean;
    error: string;
}

export function AuthForm({
                             onSubmit,
                             isLoading,
                             error,
                         }: AuthFormProps) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [apiUrl, setApiUrl] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const credentials: GreenApiCredentials = {
            apiUrl: apiUrl.trim(),
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
        };

        if (
            !credentials.apiUrl ||
            !credentials.idInstance ||
            !credentials.apiTokenInstance
        ) {
            return;
        }

        onSubmit(credentials);
    };

    return (
        <div className="auth">
            <form className="auth__form" onSubmit={handleSubmit}>
                <div className="auth__header">
                    <h1>MAX Chat</h1>
                    <p>Подключение к GREEN-API</p>
                </div>

                <label className="auth__field">
                    <span>apiUrl</span>

                    <input
                        type="url"
                        value={apiUrl}
                        onChange={(event) => setApiUrl(event.target.value)}
                        placeholder="https://3100.api.green-api.com"
                        autoComplete="off"
                    />
                </label>

                <label className="auth__field">
                    <span>idInstance</span>

                    <input
                        type="text"
                        value={idInstance}
                        onChange={(event) => setIdInstance(event.target.value)}
                        placeholder="Введите idInstance"
                        autoComplete="off"
                    />
                </label>

                <label className="auth__field">
                    <span>apiTokenInstance</span>

                    <input
                        type="password"
                        value={apiTokenInstance}
                        onChange={(event) => setApiTokenInstance(event.target.value)}
                        placeholder="Введите apiTokenInstance"
                        autoComplete="off"
                    />
                </label>
                {error && (
                    <div className="auth__error">
                        {error}
                    </div>
                )}
                <button
                    className="auth__submit"
                    type="submit"
                    disabled={
                        isLoading ||
                        !apiUrl.trim() ||
                        !idInstance.trim() ||
                        !apiTokenInstance.trim()
                    }
                >
                    {isLoading ? 'Подключение...' : 'Войти'}
                </button>
            </form>
        </div>
    );
}