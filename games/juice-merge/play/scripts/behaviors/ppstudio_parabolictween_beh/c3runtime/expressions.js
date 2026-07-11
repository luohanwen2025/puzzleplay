"use strict";
const C3 = globalThis.C3;
{	
	C3.Behaviors.ppstudio_parabolictween_beh.Exps =
	{
		GetGravityAngle(){
			return this._adjangle;
		},

		GetTag(){
			return this._currentTagTriggered;
		},
		
		GetTweenMaxTime(tag){
			if (this._tweens[tag]==undefined){
				console.warn("GetTweenMaxTime expression called when there's no tweens running.","Ivalid tween tag name:"+tag);
				return 0;
			}			

			return this._tweens[tag]["time"];
		},

		GetProgress(tag){
			if (this._tweens[tag]==undefined){
				console.warn("GetProgress expression called when there's no tweens running.","Ivalid tween tag name:"+tag);
				return 0;
			}			

			return this._tweens[tag]["currentTime"]/this._tweens[tag]["time"];
		},

		GetOffsetX(tag){
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["offsetX"];
		},

		GetOffsetY(tag){
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["offsetY"];
		},

		GetXAt(tag,time){
			return this._getXAt(tag,time*this._factor);
		},

		GetYAt(tag,time){
			return this._getYAt(tag,time*this._factor);
		},

		GetVelocityX(tag){	
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["vx"]*this._factor;
		},

		GetVelocityY(tag){	
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["vy"]*this._factor;
		},

		GetAngleAt(tag){	
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["angle"];
		},

		GetVelocity(tag){
			if (this._parabolas[tag]==undefined)
				return 0;

			return this._parabolas[tag]["velocity"]*this._factor;
		},

		GetX(tag){
			if (this._tweens[tag]==undefined){
				console.warn("GetX expression called when there's no tweens running.","Ivalid tween tag name:"+tag);
				return 0;
			}
			return this._getXAt(tag,this._tweens[tag]["currentTime"]*this._factor);
		},

		GetY(tag){
			if (this._tweens[tag]==undefined){
				console.warn("GetY expression called when there's no tweens running.","Ivalid tween tag name:"+tag);
				return 0;
			}
			return this._getYAt(tag,this._tweens[tag]["currentTime"]*this._factor);
		},

		GetProjectileAngleAt(tag,time){
			return this._projectileAngle(tag,time);
		},

		GetProjectileAngle(tag){
			if (this._parabolas[tag]==undefined)
				return 0;

			if (this._tweens[tag]==undefined){
				console.warn("GetProjectileAngle expression called when there's no tweens running.","Ivalid tween tag name:"+tag);
				return 0;
			}	

			return this._projectileAngle(tag,this._tweens[tag]["currentTime"]*this._factor);
		}
	};
}