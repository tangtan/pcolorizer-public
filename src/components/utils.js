export function arrNormalization(arr) {
    let total = 0;
    arr.forEach((v) => total += v);
    if(total === 0) return arr.map(_ => 0)
    else return arr.map((v) => v / total);
}

export function arrMaxNormalization(arr) {
    const maxValue = Math.max(...arr);
    return arr.map((v) => v / maxValue);
}

export function listNormalization(list) {
    let total = 0;
    list.forEach((v) => total += v[1]);
    return list.map((v) => [v[0], v[1] / total]);
}

// hard code
export function listNormalizationV3(list) {
    let total = 0;
    list.forEach((v) => total += v[2]);
    return list.map((v) => [v[0], v[1], v[2] / total]);
}

// hard code
export function listMaxNormalization(list) {
    let maxValue = 0;
    list.forEach((v) => {
        if(v[1] > maxValue) maxValue = v[1];
    })
    return list.map((v) => [v[0], v[1] / maxValue, v[2], v[3]]);
}

export function RGB216(colorRGB) {
    let color = colorRGB
    //十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(color)) {
        const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;    
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = color;    
        }
        return strHex;
    } else if (reg.test(color)) {
        const aNum = color.replace(/#/,"").split("");
        if (aNum.length === 6) {
            return color;    
        } else if(aNum.length === 3) {
            let numHex = "#";
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    console.log(color)
    return color;
};

export function adaptWH(img, container) {
    const w1 = img[0];
    const h1 = img[1];
    const w2 = container[0];
    const h2 = container[1];
    const ratioW = w1 / w2;
    const ratioH = h1 / h2;

    if(w1 <= w2 && h1 <= h2) {
        if(ratioW < ratioH) {
            return [h2 * (w1 / h1), h2]
        } else {
            return [w2, w2 * (h1 / w1)]
        }
    } else if(w1 > w2 && h1 > h2) {
        if(ratioW < ratioH) {
            return [h2 * (w1 / h1), h2]
        } else {
            return [w2, w2 * (h1 / w1)]
        }
    } else if(w1 <= w2 && h1 > h2) {
        return [h2 * (w1 / h1), h2]
    } else if(w1 > w2 && h1 <= h2) {
        return [w2, w2 * (h1 / w1)]
    }
}