import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";

type FeatureItem = {
    title: string;
    SvgDark: React.ComponentType<React.ComponentProps<"svg">>;
    SvgLight: React.ComponentType<React.ComponentProps<"svg">>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: "Fully custom particle system",
        SvgDark: require("@site/static/img/particlesDark.svg").default,
        SvgLight: require("@site/static/img/particlesLight.svg").default,
        description: <>Allows for a much bigger range of customization and control over particles.</>,
    },
    {
        title: "Custom node-based UI",
        SvgDark: require("@site/static/img/layoutDark.svg").default,
        SvgLight: require("@site/static/img/layoutLight.svg").default,
        description: <>A new simple and intuitive way of constructing particle systems.</>,
    },
    {
        title: "Made with TS and React",
        SvgDark: require("@site/static/img/codeDark.svg").default,
        SvgLight: require("@site/static/img/codeLight.svg").default,
        description: <>Built with TypeScript and React, Lumina is a modern and easy-to-use particle system.</>,
    },
];

function Feature({ title, SvgDark, SvgLight, description }: FeatureItem) {
    const { colorMode, setColorMode } = useColorMode();

    return (
        <div className={clsx("col col--4")}>
            <div className="text--center">
                {colorMode === "dark" ? (
                    <SvgLight className={styles.featureSvg} role="img" />
                ) : (
                    <SvgDark className={styles.featureSvg} role="img" />
                )}
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
