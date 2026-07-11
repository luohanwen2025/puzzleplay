"use strict";
const C3 = globalThis.C3;
{
	C3.Behaviors.ppstudio_parabolictween_beh.Cnds =
	{
		OnTweeningParabolaFinished(tag){
			return this._currentTagTriggered===tag;
		},

		IsPlaying(tag){
			if (this._tweens[tag])
				return this._tweens[tag]["alive"];
			return false;
		},

		OnAnyTweeningParabolaFinished(){
			return true;
		},

		IsAnyPlaying(){
			let keys=Object.keys(this._tweens);
			for(let i=0;i<keys.length;i++){
				if (this._tweens[keys[i]]["alive"])
					return true;
			}
			return false;
		},

		IsEnabled(){
			return this._isEnabled;
		}
	};
}