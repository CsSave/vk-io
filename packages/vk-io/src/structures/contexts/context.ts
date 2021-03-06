import { inspect } from 'util';

import { VK } from '../../vk';
import { inspectCustomData, UpdateSource } from '../../utils/constants';

import { AllowArray } from '../../types';

export interface IContextOptions<
	P,
	S,
	Type extends string = string,
	SubType extends string = string
> {
	vk: VK;

	type: Type;
	subTypes: SubType[];

	payload: P;
	state?: S;

	source: UpdateSource;
	updateType: string | number;

	groupId?: number;
}

export type ContextFactoryOptions<P, S> =
	Omit<IContextOptions<P, S>, 'type' | 'subTypes'>;

export class Context<
	P = {},
	S = {},
	Type extends string = string,
	SubType extends string = string
> {
	public type: Type;

	public subTypes: SubType[];

	public state: S;

	public vk: VK;

	public $groupId?: number;

	protected payload: P;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;

	/**
	 * Constructor
	 */
	public constructor(options: IContextOptions<P, S, Type, SubType>) {
		this.vk = options.vk;

		this.type = options.type;
		this.subTypes = options.subTypes;

		this.payload = options.payload;
		this.state = options.state || {} as S;

		this.$groupId = options.groupId;
	}

	/**
	 * Returns custom tag
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Checks whether the context of some of these types
	 */
	public is(rawTypes: AllowArray<Type | SubType>): boolean {
		const types = !Array.isArray(rawTypes)
			? [rawTypes]
			: rawTypes;

		return [this.type, ...this.subTypes].some((type): boolean => (
			types.includes(type)
		));
	}

	/**
	 * Returns data for JSON
	 */
	public toJSON(): object {
		return {
			...this[inspectCustomData](),

			type: this.type,
			subTypes: this.subTypes,
			state: this.state
		};
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { vk, ...payload } = this;

		return payload;
	}

	/**
	 * Custom inspect object
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public [inspect.custom](depth: number, options: Record<string, any>): string {
		const payload = inspect(this.toJSON(), {
			...options,

			compact: false
		});

		return `${options.stylize(this.constructor.name, 'special')} ${payload}`;
	}
}
