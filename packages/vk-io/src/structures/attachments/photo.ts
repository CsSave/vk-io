import { VK } from '../../vk';

import { Attachment } from './attachment';

import { pickProperties } from '../../utils/helpers';
import { AttachmentType, inspectCustomData } from '../../utils/constants';

const { PHOTO } = AttachmentType;

const SMALL_SIZES = ['m', 's'];
const MEDIUM_SIZES = ['y', 'r', 'q', 'p', ...SMALL_SIZES];
const LARGE_SIZES = ['w', 'z', ...MEDIUM_SIZES];

export interface IPhotoSize {
	type: string;
	url: string;
	width: number;
	height: number;
}

export interface IPhotoAttachmentPayload {
	id: number;
	owner_id: number;
	access_key?: string;

	album_id?: number;
	user_id?: number;
	text?: string;
	date?: number;
	sizes?: IPhotoSize[];
	width?: number;
	height?: number;
}

export class PhotoAttachment extends Attachment<IPhotoAttachmentPayload> {
	/**
	 * Constructor
	 */
	public constructor(payload: IPhotoAttachmentPayload, vk?: VK) {
		super(PHOTO, payload.owner_id, payload.id, payload.access_key);

		// @ts-ignore
		this.vk = vk;
		this.payload = payload;

		this.$filled = payload.album_id !== undefined && payload.date !== undefined;
	}

	/**
	 * Load attachment payload
	 */
	public async loadAttachmentPayload(): Promise<void> {
		if (this.$filled) {
			return;
		}

		const [photo] = await this.vk.api.photos.getById({
			photos: `${this.ownerId}_${this.id}`,
			extended: 0
		});

		// @ts-ignore
		this.payload = photo;

		if (this.payload.access_key) {
			this.accessKey = this.payload.access_key;
		}

		this.$filled = true;
	}

	/**
	 * Returns the ID of the user who uploaded the image
	 */
	public get userId(): number | undefined {
		return this.payload.user_id;
	}

	/**
	 * Returns the ID of the album
	 */
	public get albumId(): number | undefined {
		return this.payload.album_id;
	}

	/**
	 * Returns the photo text
	 */
	public get text(): string | undefined {
		return this.payload.text;
	}

	/**
	 * Returns the date when this photo was created
	 */
	public get createdAt(): number | undefined {
		return this.payload.date;
	}

	/**
	 * Returns the photo height
	 */
	public get height(): number | undefined {
		return this.payload.height;
	}

	/**
	 * Returns the photo width
	 */
	public get width(): number | undefined {
		return this.payload.width;
	}

	/**
	 * Returns the URL of a small photo
	 * (130 or 75)
	 */
	public get smallPhoto(): string | undefined {
		if (!this.$filled) {
			return undefined;
		}

		const [size] = this.getSizes(SMALL_SIZES);

		return size.url;
	}

	/**
	 * Returns the URL of a medium photo
	 * (807 or 604 or less)
	 */
	public get mediumPhoto(): string | undefined {
		if (!this.$filled) {
			return undefined;
		}

		const [size] = this.getSizes(MEDIUM_SIZES);

		return size.url;
	}

	/**
	 * Returns the URL of a large photo
	 * (2560 or 1280 or less)
	 */
	public get largePhoto(): string | undefined {
		if (!this.$filled) {
			return undefined;
		}

		const [size] = this.getSizes(LARGE_SIZES);

		return size.url;
	}

	/**
	 * Returns the sizes
	 */
	public get sizes(): IPhotoSize[] | undefined {
		return this.payload.sizes;
	}

	/**
	 * Returns the sizes of the required types
	 */
	public getSizes(sizeTypes: string[]): IPhotoSize[] {
		const { sizes } = this;

		if (!sizes) {
			return [];
		}

		// @ts-ignore
		return sizeTypes
			.map((sizeType): IPhotoSize | undefined => (
				sizes.find((size): boolean => size.type === sizeType)
			))
			.filter(Boolean);
	}

	/**
	 * Returns the custom data
	 */
	public [inspectCustomData](): object {
		return pickProperties(this, [
			'userId',
			'albumId',
			'text',
			'createdAt',
			'height',
			'width',
			'smallPhoto',
			'mediumPhoto',
			'largePhoto',
			'sizes'
		]);
	}
}
