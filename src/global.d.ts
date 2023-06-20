type UserPrefs = {
	[preference: string]: boolean | string | string[] | number;
};

interface UserscriptTracker {
	[script: string]: boolean;
}

interface InsertedCSS {
	[identifier: string]: string;
}

interface IUserscript {
	name: string;
	fullpath: string;
	content?: string;
	exported?: {
		meta?: UserscriptMeta | false,
		unload?: Function | false
	}
}

interface IUserscriptInstance extends IUserscript {
	meta: UserscriptMeta | false,
	hasRan: boolean,
	runAt: ('document-start' | 'document-end'),
	load: Function,
	unload: Function | false
}

interface UserscriptMeta {
	name: string;
	author: string;
	version: string;
	desc: string;
	src: string;
}

/** krunker injects these into the window object */
interface Window {
	errAlert: Function;
	OffCliV: boolean;
	getGameActivity: Function
}

/*
 *	these setting type defs do look complicated but they just ensure a noob can easily create a new setting.
 *	basically, settings are SettingItemGeneric + a type: string. some types have extra fields, as you can see 
 */

type Callbacks = 'normal' | 'userscript' | Function;
type ValidTypes = 'bool' | 'heading' | 'text' | 'sel' | 'multisel' | 'num';

interface SettingItemGeneric {
	title: string;
	desc?: string;
	safety: number;
	type: ValidTypes;

	// category
	cat?: number;

	/** applies instantly */
	instant?: boolean;

	/** only refresh, not full restart required */
	refreshOnly?: boolean;
}

// sel has to have an opts with a string array
interface SelectSettingDescItem extends SettingItemGeneric { type: 'sel', opts?: string[] }

interface MultiselectSettingDescItem extends SettingItemGeneric { type: 'multisel', opts?: string[], cols: number }

// num has to have a min and max
interface NumSettingItem extends SettingItemGeneric { type: 'num', min?: number, max?: number }


type SettingsDescItem = (SettingItemGeneric | NumSettingItem | SelectSettingDescItem | MultiselectSettingDescItem);

/** array of SettingDescItem objects */
interface SettingsDesc {
	[settingKey: string]: SettingsDescItem;
}

/** a render-ready setting. contains a SettingsDescItem + value, callback and key */
interface RenderReadySetting extends SettingItemGeneric {
	type: ValidTypes;

	// for sel
	opts?: string[];
	cols?: number;

	// for num
	min?: number;
	max?: number;
	step?: number;

	// the data
	key: string;
	callback: Callbacks;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;

	// an optional unload function (for now for userscripts)
	userscriptReference?: IUserscriptInstance
}

interface CategoryName {
	name: string;
	cat: string;
	note?: string;
}

// discord rpc
type RPCargs = { details: string, state: string };

/** 
 * return type of window.getGameActivity()
 * we can't ensure krunker doesen't change or fail to return this exact object
 * this should be consumed as `Partial<GameInfo>` with fallbacks from elements for properties you are using 
 */
interface GameInfo {

	/** example: FRA:h83cx */
	id: string,

	/** example: 126 */
	time: number,

	/** example: KraXen72 */
	user: string,
	class: {

		/** example: Triggerman */
		name: string,

		/** example: "0"*/
		index?: string
	},

	/** example: Subzero */
	map: string,

	/** example: Free for All */
	mode: string,

	/** example: false */
	custom: boolean,

	/** added by us, example: Baller */
	skin?: string
}

interface IMatchmakerCriteria {
	minPlayers: number,
	maxPlayers: number,

	/** e.g. FRA */
	regions: string[],

	/** e.g. 'Free for All' */
	gameModes: string[],

	/** remaining time in seconds */
	minRemainingTime: number,
}

interface IMatchmakerGame {
	gameID: string;
	region: string;
	playerCount: number;
	playerLimit: number;
	map: string;
	gamemode: string;
	remainingTime: number;
}
