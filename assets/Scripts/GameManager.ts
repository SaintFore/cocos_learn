import { _decorator, CCInteger, Component, Node, Prefab, instantiate } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE, // 无方块
    BT_STONE, // 普通方块
};

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    public boxPrefab: Prefab | null = null;

    @property({ type: CCInteger })
    public roadLength: number = 50; // 道路长度
    private _road: BlockType[] = []; // 道路数据

    start() {
        this.generateRoad(); // 生成道路

    }

    update(deltaTime: number) {

    }

    generateRoad() {

        this.node.removeAllChildren(); // 清空当前节点下的所有子节点

        this._road = []; // 清空道路数据
        this._road.push(BlockType.BT_STONE); // 添加第一个方块

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) { // 如果前一个方块是空的，则生成一个石头方块
                this._road.push(BlockType.BT_STONE);
            }
            else {
                this._road.push(Math.floor(Math.random() * 2)); // 随机生成方块类型
            }
        }

        for (let i = 0; i < this._road.length; i++) {
            let block: Node | null = this.spawnBlockByType(this._road[i]);
            if (block) {
                this.node.addChild(block);
                block.setPosition(i * BLOCK_SIZE, 0, 0); // 设置方块位置
            }
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.boxPrefab) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = instantiate(this.boxPrefab);
                break;
        }

        return block;
    }
}
