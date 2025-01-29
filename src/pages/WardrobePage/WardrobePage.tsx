import React from "react";
import { WardrobeIcon } from "../../components/wardrobe/WardrobeIcon/WardrobeIcon";
import WardrobeTabs from "../../components/wardrobe/WardrobeTabs/WardrobeTabs";

export const WardrobePage: React.FC = () => {
    return (
        <div>
            <WardrobeIcon/>
            <WardrobeTabs/>
        </div>
    );
}