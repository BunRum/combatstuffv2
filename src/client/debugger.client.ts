import Iris from "@rbxts/iris";
import Object from "@rbxts/object-utils";
import {allPlayingAnimations} from "shared/animationClass";
import {allCombatClasses} from "shared/combat/entity";
import {allEntities} from "shared/combat/entity/allEntities";
import {bindedInputs} from "shared/inputModule";

Iris.Init();

function rec(tbl: unknown, s: string) {
    const tableTyped = tbl as Record<string, unknown>;
    Iris.Tree([s]);
    Object.keys(tableTyped).forEach((g) => {
        if (typeOf(tableTyped[g]) === "table") {
            rec(tableTyped[g], g);
        } else {
            Iris.Text([`${g}: ${tableTyped[g]}`]);
        }
    });
    Iris.End();
}

let unboundalready = false;

allEntities.wait().andThen(() => Iris.Connect(() => {
    const window = Iris.Window(["trying"]);
    ``

    Iris.Text(["allCombatClasses"]);
    Object.keys(allCombatClasses).forEach((className) => {
        if (Iris.Button([className]).clicked()) {
            allEntities.getLocalEntity().assignClass(className);
        }
    });

    Iris.Tree(["All Entities"]);
    allEntities.getArray().forEach((e, index) => {
        rec(e, tostring(index));
    });
    Iris.End();

    // bindedInputs.
    rec(bindedInputs, "binded Inputs");
    rec(allPlayingAnimations, "all Playing Animations")

    const speedModifierInput = Iris.InputNum(["Speed Modifier", 0.1, 0], {
        number: allEntities.getLocalEntity().defaultWalkSpeed,
    });
    // speedModifierInput.numberChanged()
    if (speedModifierInput.numberChanged()) {
        allEntities.getLocalEntity().combat.speedModifier = speedModifierInput.state.number.value;
    }

    Iris.Text([`Current Position: ${allEntities.getLocalEntity().currentCFrame().Position}`]);

    if (window.hovered()) {
        // print("hovered")
        allEntities.getLocalEntity().combat.UnbindAll();
        unboundalready = false;
    } else {
        if (!unboundalready) {
            allEntities.getLocalEntity().combat.bindInputs();
            unboundalready = true;
        }
    }

    Iris.End();
}))
