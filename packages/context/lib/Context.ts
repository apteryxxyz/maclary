import type {
    Attachment,
    Guild,
    GuildTextBasedChannel,
    Locale,
    PermissionsBitField,
    Snowflake,
} from 'discord.js';
import {
    Base,
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Collection,
    DiscordjsError,
    DiscordjsErrorCodes,
    GuildMember,
    Message,
    TextChannel,
} from 'discord.js';
import { _deferred, _replied, _replies, _reply } from './symbols';

const ChatInput = ChatInputCommandInteraction;

interface Types {
    Channel: GuildTextBasedChannel | TextChannel;
    Guild: Guild;
    Input: ChatInputCommandInteraction;
    Message: Message;
}

type If<T, C, M> = T extends ChatInputCommandInteraction ? C : M;

/**
 * A context class for a message or chat input interaction.
 * @template P The parent type, either a {@link ChatInputCommandInteraction} or a {@link Message}.
 */
export class Context<
    P extends Types['Input'] | Types['Message'] = Types['Input'] | Types['Message']
> extends Base {
    public parent: P;

    private [_deferred] = false;
    private [_replied] = false;
    private [_replies] = new Collection<Snowflake, Message>();

    public constructor(parent: P) {
        if (parent instanceof ChatInput === parent instanceof Message)
            throw new TypeError('P must be a `ChatInputCommandInteraction` or `Message`');

        super(parent.client);
        this.parent = parent;
    }

    /**
     * Set of permissions the application or bot has within the channel this was sent from.
     */
    public get appPermissions(): Readonly<PermissionsBitField> | null {
        if (!this.parent.inGuild()) return null;
        if (this.parent instanceof ChatInput) return this.parent.appPermissions;
        return this.parent.channel.permissionsFor(this.client.user);
    }

    /**
     * A collection of attachments in this, mapped by their ids.
     */
    public get attachments(): Collection<Snowflake, Attachment> {
        if (this.parent instanceof Message) return this.parent.attachments;

        const options = Reflect.get(this.parent.options, '_hoistedOptions');
        const attachments: [string, Attachment][] = (options as any[])
            .filter((opt): opt is { attachment: Attachment; type: 11 } => opt.type === 11)
            .map(opt => [opt.attachment.id, opt.attachment]);
        return new Collection(attachments);
    }

    /**
     * The channel that this was sent in.
     */
    public get channel(): If<P, Types['Input']['channel'], Types['Message']['channel'] | null> {
        return this.parent.channel;
    }

    /**
     * The ID of the channel this was sent in.
     */
    public get channelId(): Snowflake | null {
        return this.parent.channelId;
    }

    /**
     * The content of the message, or a string representation of the chat input interaction.
     */
    public get content(): string {
        if (this.parent instanceof Message) return this.parent.content;
        return this.parent.toString();
    }

    /**
     * The time this was sent at.
     */
    public get createdAt(): Date {
        return this.parent.createdAt;
    }

    /**
     * The timestamp this was sent at.
     */
    public get createdTimestamp(): number {
        return this.parent.createdTimestamp;
    }

    /**
     * Whether the reply to this has been deferred.
     */
    public get deferred(): boolean {
        return this[_deferred];
    }

    /**
     * The time this was edited at (if applicable).
     */
    public get editedAt(): If<P, undefined, Types['Message']['editedAt']> {
        // @ts-expect-error 2322
        return Reflect.get(this.parent, 'editedAt');
    }

    /**
     * The timestamp this was edited at (if applicable).
     */
    public get editedTimestamp(): If<P, undefined, Types['Message']['editedTimestamp']> {
        // @ts-expect-error 2322
        return Reflect.get(this.parent, 'editedTimestamp');
    }

    /**
     * The guild this was sent in (if applicable)..
     */
    public get guild(): Guild | null {
        return this.parent.guild;
    }

    /**
     * The ID of the guild this was sent in (if applicable)..
     */
    public get guildId(): Snowflake | null {
        return this.parent.guildId;
    }

    /**
     * The preferred locale from the guild this was sent in (if applicable)..
     */
    public get guildLocale(): If<
        P,
        Types['Input']['guildLocale'],
        Types['Guild']['preferredLocale'] | undefined
    > {
        // @ts-expect-error 2322
        return this.parent instanceof ChatInput
            ? this.parent.guildLocale
            : this.parent.guild?.preferredLocale;
    }

    /**
     * This's ID.
     */
    public get id(): Snowflake {
        return this.parent.id;
    }

    /**
     * If this was sent in a guild, the member which sent it.
     */
    public get member(): If<P, Types['Input']['member'], Types['Message']['member']> {
        // @ts-expect-error 2322
        return this.parent.member;
    }

    /**
     * The ID of member that sent this (if applicable).
     */
    public get memberId(): Snowflake | null {
        return this.user.id;
    }

    /**
     * Ther permissions of the member in the channel this was sent in (if applicable).
     */
    public get memberPermissions(): Readonly<PermissionsBitField> | null {
        if (!this.inGuild()) return null;
        if (this.parent instanceof ChatInput) return this.parent.memberPermissions;

        if (this.parent.channel instanceof BaseGuildTextChannel)
            return this.parent.channel.permissionsFor(this.parent.author.id);
        if (this.parent.member instanceof GuildMember)
            return this.parent.member.permissionsIn(this.parent.channelId);
        return null;
    }

    /**
     * Whether this has already been replied to.
     */
    public get replied(): boolean {
        return this[_replied];
    }

    /**
     * The user who sent this.
     */
    public get user(): If<P, Types['Input']['user'], Types['Message']['author']> {
        return this.parent instanceof ChatInput ? this.parent.user : this.parent.author;
    }

    /**
     * The ID of the user who sent this.
     */
    public get userId(): Snowflake {
        return this.user.id;
    }

    public get userLocale(): If<P, Locale, null> {
        // @ts-expect-error 2322
        return this.parent instanceof ChatInput ? this.parent.locale : null;
    }

    /**
     * Defers the reply to this.
     * @param args The options for this defer.
     */
    public deferReply(
        ...args: Parameters<If<P, Types['Input']['deferReply'], Types['Channel']['sendTyping']>>
    ): ReturnType<If<P, Types['Input']['deferReply'], Types['Channel']['sendTyping']>> {
        if (this.deferred || this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);

        this[_deferred] = true;
        // @ts-expect-error 2322
        if (this.parent instanceof ChatInput) return this.parent.deferReply(...args);
        // @ts-expect-error 2556
        else return this.channel.sendTyping(...args);
    }

    /**
     * Deletes the initial reply to this.
     * @param args The options for this delete.
     */
    public deleteReply(
        ...args: Parameters<If<P, Types['Input']['deleteReply'], Types['Message']['delete']>>
    ): ReturnType<If<P, Types['Input']['deleteReply'], Types['Message']['delete']>> {
        if (!this.deferred && !this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionNotReplied);

        if (this.parent instanceof Message) {
            const reply = this[_replies].first();
            // @ts-expect-error 2556
            return reply?.delete(...args);
        }

        // @ts-expect-error 2322
        return this.parent.deleteReply(...args);
    }

    /**
     * Edits the intial reply to this.
     * @param args The options for this edit.
     */
    public editReply(
        ...args: Parameters<If<P, Types['Input']['editReply'], Types['Message']['edit']>>
    ): ReturnType<If<P, Types['Input']['editReply'], Types['Message']['edit']>> {
        if (!this.deferred && !this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionNotReplied);

        if (this.parent instanceof ChatInput) {
            // @ts-expect-error 2556
            return this.parent.editReply(...args);
        }

        if (this.replied) {
            const reply = this[_replies].first();
            // @ts-expect-error 2556
            return reply?.edit(...args);
        } else {
            // @ts-expect-error 2556
            return this[_reply](...args);
        }
    }

    /**
     * Fetches the initial reply to this.
     * @param args The options for the fetch.
     */
    public fetchReply(
        ...args: Parameters<If<P, Types['Input']['fetchReply'], Types['Message']['fetch']>>
    ): ReturnType<If<P, Types['Input']['fetchReply'], Types['Message']['fetch']>> {
        if (!this.deferred && !this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionNotReplied);

        if (this.parent instanceof ChatInput) {
            // @ts-expect-error 2556
            return this.parent.fetchReply(...args);
        }

        if (this.replied) {
            const replyId = this[_replies].firstKey();
            // @ts-expect-error 2322
            return this.client.channels.fetch(this.channelId ?? '').then(chl => {
                if (!(chl instanceof TextChannel)) return null;
                return chl.messages.fetch(replyId ?? '');
            });
        } else {
            // @ts-expect-error 2556
            return this[_reply](...args);
        }
    }

    /**
     * Send a follow-up message to this.
     * @param args The options for the follow up.
     */
    public followUp(
        ...args: Parameters<If<P, Types['Input']['followUp'], Types['Message']['reply']>>
    ): ReturnType<If<P, Types['Input']['followUp'], Types['Message']['reply']>> {
        if (this.deferred || this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);

        // @ts-expect-error 2322
        if (this.parent instanceof ChatInput) return this.parent.followUp(...args);
        // @ts-expect-error 2556
        else return this.channel.send(...args);
    }

    /**
     * Indicates whether this is received from a guild.
     */
    public inGuild(): boolean {
        return this.parent.inGuild();
    }

    /**
     * Indicates whether or not this is both cached and received from a guild.
     */
    public inCachedGuild(): boolean {
        return this.inGuild() && Boolean(this.guild);
    }

    /**
     * Indicates whether or not this is received from an uncached guild.
     */
    public inRawGuild(): boolean {
        return this.inGuild() && !this.guild;
    }

    // NOTE: These can cause issues with typings, commented out for now
    // public isMessage(): this is Context<Message> {
    //     return this.parent instanceof Message;
    // }
    public isChatInput(): this is Context<ChatInputCommandInteraction> {
        return this.parent instanceof ChatInput;
    }

    /**
     * Sends the initial reply to this.
     * @param args The options for the reply.
     */
    public reply(
        ...args: Parameters<If<P, Types['Input']['reply'], Types['Message']['reply']>>
    ): ReturnType<If<P, Types['Input']['reply'], Types['Message']['reply']>> {
        if (this.deferred || this.replied)
            throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);

        // @ts-expect-error 2556
        return this.parent instanceof ChatInput
            ? // @ts-expect-error 2556
              this.parent.reply(...args)
            : this[_reply](...args);
    }

    public async [_reply](...args: any[]) {
        // @ts-expect-error 2556
        return this.parent.reply(...args).then(async response => {
            this[_replies].set(response.id, response);
            return response;
        });
    }

    /**
     * Returns this's content.
     */
    public override toString(): string {
        return this.parent.toString();
    }
}
