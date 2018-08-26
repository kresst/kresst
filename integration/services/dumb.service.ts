import { Injectable } from "../../src/di";

@Injectable()
export class DumbService {
    public action(): void {
        console.log("DumbService#action called!");
    }
}
