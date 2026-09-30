import type {
    CheckAccountResponse,
    GetStateInstanceResponse,
    GreenApiCredentials,
    SendMessageResponse,
    ReceiveNotificationResponse,
} from '../types/greenApi';

export async function getStateInstance(
    credentials: GreenApiCredentials,
): Promise<GetStateInstanceResponse> {
    const { apiUrl, idInstance, apiTokenInstance } = credentials;

    const baseUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
    );

    if (!response.ok) {
        throw new Error(`GREEN-API вернул ошибку ${response.status}`);
    }

    return response.json();
}

export async function checkAccount(
    credentials: GreenApiCredentials,
    phoneNumber: string,
): Promise<CheckAccountResponse> {
    const { apiUrl, idInstance, apiTokenInstance } = credentials;

    const baseUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: Number(phoneNumber),
            }),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Не удалось проверить номер. Ошибка ${response.status}`,
        );
    }

    return response.json();
}

export async function sendMessage(
    credentials: GreenApiCredentials,
    chatId: string,
    message: string,
): Promise<SendMessageResponse> {
    const { apiUrl, idInstance, apiTokenInstance } = credentials;

    const baseUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatId,
                message,
            }),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Не удалось отправить сообщение. Ошибка ${response.status}`,
        );
    }

    return response.json();
}

export async function receiveNotification(
    credentials: GreenApiCredentials,
): Promise<ReceiveNotificationResponse | null> {
    const { apiUrl, idInstance, apiTokenInstance } = credentials;

    const baseUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`,
    );

    if (!response.ok) {
        throw new Error(
            `Ошибка получения уведомлений: ${response.status}`,
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function deleteNotification(
    credentials: GreenApiCredentials,
    receiptId: number,
): Promise<void> {
    const { apiUrl, idInstance, apiTokenInstance } = credentials;

    const baseUrl = apiUrl.replace(/\/$/, '');

    const response = await fetch(
        `${baseUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
        {
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error(
            `Ошибка удаления уведомления: ${response.status}`,
        );
    }
}