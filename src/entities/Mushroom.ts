import { EntityType } from "core/Entities";
import { DamageType, Entity } from "core/Entity";
import * as Random from "util/Random";
import { TimeManager } from "util/TimeManager";

export class Mushroom extends Entity {
	public type = EntityType.Mushroom;
	public magic = 5;
	public maxHealth = 2;
	public resistances = [DamageType.Earth, DamageType.Dark];
	public weaknesses = [DamageType.Fire, DamageType.Light, DamageType.Physical];

	public update (time: TimeManager) {
		const player = this.getNearest(EntityType.EvilWizard, 5);

		if (Random.chance(0.2)) {
			this.resetMovementQueue();

		} else if (Random.chance(0.3)) {
			this.wander();

		} else {
			if (player) {
				this.moveTowards(player);
			}
		}


		super.update(time);
	}
}