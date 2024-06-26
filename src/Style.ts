export const StyleColorHexes = {
    // Main
    Background: "#101223",
    Primary: "#282A3A",
    Secondary: "#404252",
    White: "#F3F4F8",
    FullWhite: "#FFFFFF",

    TextLight: "#F3F4F8",
    TextDark: "#1A1A2F",
    TextDarkPlaceholder: "#3A3A4F", //3b3b59

    Highlight: "#5B5D6B",
    Disabled: "#3d3d4d",

    Selection: "#00ccdc",

    // Node Group
    SpawnGroup: "#7FFF7F",
    InitializeGroup: "#00FF00",
    UpdateGroup: "#FFFF00",
    RenderGroup: "#FFA500",
    EndGroup: "#FF0000",
};

export const StyleColors = {
    // Main
    Background: Color3.fromHex(StyleColorHexes.Background),
    Primary: Color3.fromHex(StyleColorHexes.Primary),
    Secondary: Color3.fromHex(StyleColorHexes.Secondary),
    White: Color3.fromHex(StyleColorHexes.White),
    FullWhite: Color3.fromHex(StyleColorHexes.FullWhite),

    TextLight: Color3.fromHex(StyleColorHexes.TextLight),
    TextDark: Color3.fromHex(StyleColorHexes.TextDark),
    TextDarkPlaceholder: Color3.fromHex(StyleColorHexes.TextDarkPlaceholder),

    Highlight: Color3.fromHex(StyleColorHexes.Highlight),
    Disabled: Color3.fromHex(StyleColorHexes.Disabled),

    Selection: Color3.fromHex(StyleColorHexes.Selection),

    // Node Group
    SpawnGroup: Color3.fromHex(StyleColorHexes.SpawnGroup),
    InitializeGroup: Color3.fromHex(StyleColorHexes.InitializeGroup),
    UpdateGroup: Color3.fromHex(StyleColorHexes.UpdateGroup),
    RenderGroup: Color3.fromHex(StyleColorHexes.RenderGroup),
    EndGroup: Color3.fromHex(StyleColorHexes.EndGroup),
};

export const StyleProperties = {
    BorderThicknes: 3,
    CornerRadius: new UDim(0, 5),
};

export const StyleText = {
    FontId: "rbxasset://fonts/families/Nunito.json",
    FontSize: 18,
    FontWeight: Enum.FontWeight.SemiBold,
};
