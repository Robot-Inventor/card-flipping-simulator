type CardRarities = "UR" | "SR" | "R" | "N";

class Card {
    private cards: CardRarities[] = [];

    constructor() {
        this.cards = this.shuffle();
    }

    /**
     * 指定された範囲のランダムな整数を返す
     * @param min 最小値
     * @param max 最大値
     * @returns ランダムな整数
     */
    private static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * カードのレアリティーを返す。確率はREADME.mdを参照
     * @returns カードのレアリティー
     */
    private static getCardRarities(): CardRarities {
        const randomInt = Card.getRandomInt(1, 1000);
        if (randomInt <= 70) {
            return "UR";
        } else if (randomInt <= 438) {
            return "SR";
        } else if (randomInt <= 688) {
            return "R";
        } else {
            return "N";
        }
    }

    /**
     * 与えられた配列をランダムな順番に並べ替える。与えられた配列を直接変更するため注意
     * @param array 並べ替えたい配列
     */
    private static randomizeArray<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = array[i];
            array[i] = array[r];
            array[r] = tmp;
        }
    }

    /**
     * 与えられた配列にSR以上のカードが含まれるかどうかを返す
     * @param cards 調べたいカードの配列
     * @returns 結果
     */
    public static includesSROrAbove(cards: CardRarities[]): boolean {
        return cards.includes("SR") || cards.includes("UR");
    }

    /**
     * カードをシャッフルし、4枚のカードのレアリティーを返す
     * @returns 4枚のカードのレアリティーの配列
     */
    public shuffle(): CardRarities[] {
        const cardRarities: CardRarities[] = [];
        for (let i = 0; i < 3; i++) {
            cardRarities.push(Card.getCardRarities());
        }

        if (!Card.includesSROrAbove(cardRarities)) {
            let lastCard = Card.getCardRarities();
            while (!Card.includesSROrAbove([lastCard])) {
                lastCard = Card.getCardRarities();
            }
            cardRarities.push(lastCard);
        } else {
            cardRarities.push(Card.getCardRarities());
        }

        Card.randomizeArray(cardRarities);
        this.cards = cardRarities;
        return cardRarities;
    }

    /**
     * 現在の4枚のカードのレアリティーを返す
     * @returns 現在のカードのレアリティーの配列
     */
    public getCurrentCards(): CardRarities[] {
        return this.cards;
    }
}

const resultsToObject = (results: CardRarities[]): Record<CardRarities | "合計", object> => {
    const numberOfUR = results.filter((r) => r === "UR").length;
    const numberOfSR = results.filter((r) => r === "SR").length;
    const numberOfR = results.filter((r) => r === "R").length;
    const numberOfN = results.filter((r) => r === "N").length;

    return {
        UR: {
            回数: numberOfUR.toLocaleString(),
            確率: `約${(Math.round((numberOfUR / results.length) * 1000) / 10).toFixed(1)}%`
        },
        SR: {
            回数: numberOfSR.toLocaleString(),
            確率: `約${(Math.round((numberOfSR / results.length) * 1000) / 10).toFixed(1)}%`
        },
        R: {
            回数: numberOfR.toLocaleString(),
            確率: `約${(Math.round((numberOfR / results.length) * 1000) / 10).toFixed(1)}%`
        },
        N: {
            回数: numberOfN.toLocaleString(),
            確率: `約${(Math.round((numberOfN / results.length) * 1000) / 10).toFixed(1)}%`
        },
        合計: {
            回数: results.length.toLocaleString(),
            確率: "N/A"
        }
    };
};

const ITEM_COSTS = [200, 210, 220, 230] as const;

/**
 * カードを1枚引くごとにシャッフルする場合のシミュレーション
 * @param itemQuantity 使用するアイテムの量
 * @returns シミュレーション結果
 */
const shuffleEachCard = (itemQuantity: number): ReturnType<typeof resultsToObject> => {
    const result: CardRarities[] = [];
    const card = new Card();

    while (itemQuantity >= ITEM_COSTS[0]) {
        const cards = card.getCurrentCards();
        result.push(cards[0]);
        itemQuantity -= ITEM_COSTS[0];

        card.shuffle();
    }

    return resultsToObject(result);
};

/**
 * カードを2枚引くごとにシャッフルする場合のシミュレーション
 * @param itemQuantity 使用するアイテムの量
 * @returns シミュレーション結果
 */
const shuffleEveryTwoCards = (itemQuantity: number): ReturnType<typeof resultsToObject> => {
    const result: CardRarities[] = [];
    const card = new Card();

    while (itemQuantity >= ITEM_COSTS[0]) {
        const cards = card.getCurrentCards();
        result.push(cards[0]);
        itemQuantity -= ITEM_COSTS[0];

        if (itemQuantity >= ITEM_COSTS[1]) {
            result.push(cards[1]);
            itemQuantity -= ITEM_COSTS[1];
        }

        card.shuffle();
    }

    return resultsToObject(result);
};

/**
 * カードを3枚引くごとにシャッフルする場合のシミュレーション
 * @param itemQuantity 使用するアイテムの量
 * @returns シミュレーション結果
 */
const shuffleEveryThreeCards = (itemQuantity: number): ReturnType<typeof resultsToObject> => {
    const result: CardRarities[] = [];
    const card = new Card();

    while (itemQuantity >= ITEM_COSTS[0]) {
        const cards = card.getCurrentCards();
        result.push(cards[0]);
        itemQuantity -= ITEM_COSTS[0];

        if (itemQuantity >= ITEM_COSTS[1]) {
            result.push(cards[1]);
            itemQuantity -= ITEM_COSTS[1];
        }

        if (itemQuantity >= ITEM_COSTS[2]) {
            result.push(cards[2]);
            itemQuantity -= ITEM_COSTS[2];
        }

        card.shuffle();
    }

    return resultsToObject(result);
};

/**
 * カードを4枚すべて引いてからシャッフルする場合のシミュレーション
 * @param itemQuantity 使用するアイテムの量
 * @returns シミュレーション結果
 */
const shuffleEveryFourCards = (itemQuantity: number): ReturnType<typeof resultsToObject> => {
    const result: CardRarities[] = [];
    const card = new Card();

    while (itemQuantity >= ITEM_COSTS[0]) {
        const cards = card.getCurrentCards();
        result.push(cards[0]);
        itemQuantity -= ITEM_COSTS[0];

        if (itemQuantity >= ITEM_COSTS[1]) {
            result.push(cards[1]);
            itemQuantity -= ITEM_COSTS[1];
        }

        if (itemQuantity >= ITEM_COSTS[2]) {
            result.push(cards[2]);
            itemQuantity -= ITEM_COSTS[2];
        }

        if (itemQuantity >= ITEM_COSTS[3]) {
            result.push(cards[3]);
            itemQuantity -= ITEM_COSTS[3];
        }

        card.shuffle();
    }

    return resultsToObject(result);
};

/**
 * SR以上が出たらシャッフルする場合のシミュレーション
 * @param itemQuantity 使用するアイテムの量
 * @returns シミュレーション結果
 */
const shuffleWhenSROrAboveAppears = (itemQuantity: number): ReturnType<typeof resultsToObject> => {
    const result: CardRarities[] = [];
    const card = new Card();

    while (itemQuantity >= ITEM_COSTS[0]) {
        const cards = card.getCurrentCards();
        const tempResult: CardRarities[] = [];

        result.push(cards[0]);
        tempResult.push(cards[0]);
        itemQuantity -= ITEM_COSTS[0];

        if (Card.includesSROrAbove(tempResult)) {
            card.shuffle();
            continue;
        }

        if (itemQuantity >= ITEM_COSTS[1]) {
            result.push(cards[1]);
            tempResult.push(cards[1]);
            itemQuantity -= ITEM_COSTS[1];

            if (Card.includesSROrAbove(tempResult)) {
                card.shuffle();
                continue;
            }
        }

        if (itemQuantity >= ITEM_COSTS[2]) {
            result.push(cards[2]);
            tempResult.push(cards[2]);
            itemQuantity -= ITEM_COSTS[2];

            if (Card.includesSROrAbove(tempResult)) {
                card.shuffle();
                continue;
            }
        }

        if (itemQuantity >= ITEM_COSTS[3]) {
            result.push(cards[3]);
            tempResult.push(cards[3]);
            itemQuantity -= ITEM_COSTS[3];
        }

        card.shuffle();
    }

    return resultsToObject(result);
};

const main = () => {
    const initialItemQuantity = 1000000000;

    console.log(
        `
== Card Flipping Simulator ==

※注意事項※
・カードの各レアリティーの確率は、README.mdを参照してください
・これは確率を用いたシミュレーターです。実行するたびに結果が変わる可能性があります
・アイテムの初期量は${initialItemQuantity.toLocaleString()}個です
・アイテムの消費量はカードを1枚引くごとに、${ITEM_COSTS.join("個, ")}個と増加していき、シャッフルで${
            ITEM_COSTS[0]
        }個にリセットされます
・アイテムの残量が足りなくなってそれまでの引き方（例：2枚引いてからシャッフル）を維持できなくなった場合はシャッフルします。そして、最後の1枚を引ける場合は引いてからシミュレーションを終了します
・シャッフルすると4枚の新しいカードが用意され、そのうち少なくとも1枚はSR以上です（最低保証）。アイテムを消費せずにシャッフルできます
・最低保証の仕組みの詳細が分からなかったため、このシミュレーターでは次のような実装をしています。実際のゲームの実装とは異なる可能性があります
　　・通常の確率に従って3枚のカードを用意する
　　・3枚のカードにSR以上が含まれる場合は、4枚目は通常の確率通りに用意する
　　・3枚のカードにSR以上が含まれない場合は、4枚目はSR以上が出るまで用意し直す
　　・4枚目が用意できたら、4枚のカードをランダムな順番に並べ替える
・このシミュレーターでは、カードを用意する際にランダムな順番に並べ替えているため、引く順番は関係ありません
　　・これは、実際のゲームの実装とは異なる可能性があります
　　・たとえば、もし実際のゲームの実装が「右端が最低保証枠」だった場合は、右から引いた方が有利になります（が、実際の実装は不明です）
`.trim()
    );

    console.log("\n\n【シミュレーション結果】");

    console.log("\n1枚引いたらシャッフルする場合");
    const resultTable = shuffleEachCard(initialItemQuantity);
    console.table(resultTable);

    console.log("\n2枚引いたらシャッフルする場合");
    const resultTable2 = shuffleEveryTwoCards(initialItemQuantity);
    console.table(resultTable2);

    console.log("\n3枚引いたらシャッフルする場合");
    const resultTable3 = shuffleEveryThreeCards(initialItemQuantity);
    console.table(resultTable3);

    console.log("\n4枚引いたらシャッフルする場合");
    const resultTable4 = shuffleEveryFourCards(initialItemQuantity);
    console.table(resultTable4);

    console.log("\nSR以上が出たらシャッフルする場合");
    const resultTable5 = shuffleWhenSROrAboveAppears(initialItemQuantity);
    console.table(resultTable5);
};

main();
