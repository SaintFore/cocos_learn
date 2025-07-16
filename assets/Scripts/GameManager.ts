import { _decorator, CCInteger, Component, Node, Prefab, instantiate, Game, Label, Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum GameState {
    GS_INIT, // 游戏初始化
    GS_PLAYING, // 游戏进行中
    GS_END, // 游戏结束
}

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

    @property({ type: Node })
    public startMenu: Node = null; // 开始菜单节点

    @property({ type: PlayerController })
    public playerCtrl: PlayerController = null; // 玩家控制器

    @property({ type: Label })
    public stepsLabel: Label = null; // 步数标签

    start() {
        this.setCurState(GameState.GS_INIT); // 设置初始状态
    }

    init() {
        if (this.startMenu) {
            this.startMenu.active = true; // 隐藏开始菜单
        }
        this.generateRoad(); // 初始化道路

        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false); // 这是候还没开始，禁用输入
            this.playerCtrl.node.setPosition(Vec3.ZERO); // 重置玩家位置
            this.playerCtrl.reset(); // 重置玩家控制器
        }
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

    setCurState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.init(); // 初始化游戏
                break;
            case GameState.GS_PLAYING:
                // 游戏进行中逻辑
                if (this.startMenu) {
                    this.startMenu.active = false; // 隐藏开始菜单
                }
                if (this.stepsLabel) {
                    this.stepsLabel.string = "Steps: 0"; // 重置步数标签
                }

                setTimeout(() => {
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true); // 启用玩家输入
                    }
                }, 0.1);
                break;
            case GameState.GS_END:
                // 游戏结束逻辑
                break;
        }
    }

    onStartButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }
}