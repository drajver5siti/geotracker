export interface BaseHandler<C, M> {
    supports: (message: M) => boolean,
    handle: (client: C, message: M) => void | Promise<void>
}

export class MessageHandler<
    M, 
    C,
    H extends BaseHandler<C, M> = BaseHandler<C, M>
>
{
    private handlers: H[] = [];

    public addHandler(handler: H) {
        this.handlers.push(handler);
    }

    public handle(client: C, message: M) {
        this.handlers
            .filter(h => h.supports(message))
            .forEach(h => h.handle(client, message));
    }
}

