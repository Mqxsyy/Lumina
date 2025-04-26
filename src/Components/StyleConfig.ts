const StyleConfig = {
    Studio: {
        Font: new Font("rbxasset://fonts/families/SourceSansPro.json", Enum.FontWeight.Regular),
        FontSemiBold: new Font("rbxasset://fonts/families/SourceSansPro.json", Enum.FontWeight.SemiBold),
        FontBold: new Font("rbxasset://fonts/families/SourceSansPro.json", Enum.FontWeight.Bold),
        FontSize: 16,
        FontColor: Color3.fromHex("aaaaaa"),
        FontColorPlaceholder: Color3.fromHex("767676"),
        Padding: 8,
        Colors: {
            Border: Color3.fromHex("222222"),
            Dark: Color3.fromHex("353535"),
            Darker: Color3.fromHex("2e2e2e"),
            Darkest: Color3.fromHex("252525"),
            DarkHighlight: Color3.fromHex("3b3b3b"),
            ButtonPrimary: Color3.fromHex("00a2ff"),
            ButtonPrimaryHighlight: Color3.fromHex("35b5ff"),
        },
    },
    Connection: {
        TypeColors: {
            Number: Color3.fromHex("3498db"),
            Vector2: Color3.fromHex("2ecc71"),
            Vector3: Color3.fromHex("e74c3c"),
            Color: Color3.fromHex("9d4edd"),
        },
    },
};

export default StyleConfig;
