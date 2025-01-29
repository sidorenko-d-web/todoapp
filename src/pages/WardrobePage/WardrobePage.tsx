import React from "react";
import { WardrobeIcon } from "../../components/wardrobe/WardrobeIcon/WardrobeIcon";
import WardrobeTabs from "../../components/wardrobe/WardrobeTabs/WardrobeTabs";
import { WardrobeInfo } from "../../components/wardrobe/WardrobeInfo/WardrobeInfo";

export const WardrobePage: React.FC = () => {
    return (
        <div>
            <WardrobeInfo/>
            <WardrobeIcon/>
            <WardrobeTabs/>
        </div>
    );
}