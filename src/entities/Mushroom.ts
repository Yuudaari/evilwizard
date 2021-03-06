import { EntityType } from "core/Entities";
import { DamageType, Entity, EntityState } from "core/Entity";
import { SoundType } from "core/Sound";
import { Random } from "util/Random";
import { TimeManager } from "util/TimeManager";

export class Mushroom extends Entity {
	public type = EntityType.Mushroom;
	public magic = 5;
	public maxHealth = 3;
	public resistances = [DamageType.Earth, DamageType.Dark];
	public weaknesses = [DamageType.Fire, DamageType.Light, DamageType.Physical];
	public damageType = [DamageType.Earth, DamageType.Dark];
	public damageAmount = 1.5;
	public stepSound = SoundType.MushroomStep;

	public update (time: TimeManager) {
		if (this.state != EntityState.Dead) {
			if (Random.chance(0.4)) {
				this.resetMovementQueue();

			} else if (Random.chance(0.5)) {
				this.wander();

			} else {
				const player = this.getNearest(EntityType.EvilWizard, 5);
				if (player) {
					this.moveTowards(player);
				}
			}
		}

		super.update(time);
	}
}
