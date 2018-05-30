import { Injectable } from "../../src";

@Injectable()
export class DumbService {
    public action(): void {
        console.log("DumbService#action called!");
    }
}
