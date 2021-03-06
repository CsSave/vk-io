import { Context, ContextFactoryOptions } from './context';

import { pickProperties } from '../../utils/helpers';
import { inspectCustomData } from '../../utils/constants';

export type VKAppPayloadContextType = 'vk_app_event';

export type VKAppPayloadContextSubType = 'vk_app_payload';

export interface IVKAppPayloadPayload {
	user_id: number;
	app_id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any;
	group_id: number;
}

export type VKAppPayloadContextOptions<S> =
	ContextFactoryOptions<IVKAppPayloadPayload, S>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class VKAppPayloadContext<S = Record<string, any>>
	extends Context<
	IVKAppPayloadPayload,
	S,
	VKAppPayloadContextType,
	VKAppPayloadContextSubType
	> {
	public constructor(options: VKAppPayloadContextOptions<S>) {
		super({
			...options,

			type: 'vk_app_event',
			subTypes: ['vk_app_payload']
		});
	}

	/**
	 * Returns the identifier of the user whose action the event was sent to in the application
	 */
	public get userId(): number {
		return this.payload.user_id;
	}

	/**
	 * Returns the identifier of the application from which the event was sent
	 */
	public get appId(): number {
		return this.payload.app_id;
	}

	/**
	 * Returns the identifier of the community to which the notification was sent
	 */
	public get groupId(): number {
		return this.payload.group_id;
	}

	/**
	 * Returns the transferred useful data
	 */
	public get eventPayload(): number {
		return this.payload.payload;
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		return pickProperties(this, [
			'userId',
			'appId',
			'groupId',
			'eventPayload'
		]);
	}
}
