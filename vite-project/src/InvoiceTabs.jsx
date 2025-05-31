import React, { useState } from "react";
import {
    Tabs,
    Tab,
    Box
} from "@mui/material";
import EstimateTab from "./tabs/EstimateTab";
import PurchasedTab from "./tabs/PurchasedTab";
import TransportTab from "./tabs/TransportTab";
import PartsTab from "./tabs/PartsTab";
import MechanicTab from "./tabs/MechanicTab";
import BodyshopTab from "./tabs/BodyshopTab";
import DetailTab from "./tabs/DetailTab";
import SoldTab from "./tabs/SoldTab";
import InvoiceTab from "./tabs/InvoiceTab";

const InvoiceTabs = ({ formData, setFormData }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <EstimateTab formData={formData} />;
            case 1:
                return <PurchasedTab formData={formData} setFormData={setFormData} />;
            case 2:
                return <TransportTab formData={formData} setFormData={setFormData} />;
            case 3:
                return <PartsTab formData={formData} setFormData={setFormData} />;
            case 4:
                return <MechanicTab formData={formData} setFormData={setFormData} />;
            case 5:
                return <BodyshopTab formData={formData} setFormData={setFormData} />;
            case 6:
                return <DetailTab formData={formData} setFormData={setFormData} />;
            case 7:
                return <SoldTab formData={formData} setFormData={setFormData} />;
            case 8:
                return <InvoiceTab formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Estimate" />
                <Tab label="Purchased" />
                <Tab label="Transport" />
                <Tab label="Parts" />
                <Tab label="Mechanic" />
                <Tab label="Bodyshop" />
                <Tab label="Misc." />
                <Tab label="Sold" />
                <Tab label="Invoice" />
            </Tabs>
            <Box sx={{ mt: 2 }}>{renderTabContent()}</Box>
        </>
    );
};

export default InvoiceTabs;