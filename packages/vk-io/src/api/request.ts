import { inspect } from 'util';

import { getExecuteMethod } from '../utils/helpers';
import { ICallbackServiceValidate } from '../utils/callback-service';

export interface IAPIRequestOptions {
	method: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: Record<string, any>;
}

export class APIRequest {
	public method: string;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public params: Record<string, any>;

	public attempts = 0;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public promise: Promise<any>;

	public resolve!: Function;

	public reject!: Function;

	public captchaValidate?: ICallbackServiceValidate;

	/**
	 * Constructor
	 */
	public constructor({ method, params = {} }: IAPIRequestOptions) {
		this.method = method;
		this.params = { ...params };

		this.promise = new Promise((resolve, reject): void => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	/**
	 * Returns custom tag
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Adds attempt
	 */
	public addAttempt(): number {
		this.attempts += 1;

		return this.attempts;
	}

	/**
	 * Returns string to execute
	 */
	public toString(): string {
		return getExecuteMethod(this.method, this.params);
	}

	/**
	 * Custom inspect object
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public [inspect.custom](depth: number, options: Record<string, any>): string {
		const { method, params, promise } = this;

		const payload = { method, params, promise };

		return `${options.stylize(this.constructor.name, 'special')} ${inspect(payload, options)}`;
	}
}
