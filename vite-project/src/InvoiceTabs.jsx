import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
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

    const updateSection = (sectionKey, newData) => {
        setFormData(prev => ({
            Car: {
                ...prev.Car,
                [sectionKey]: newData
            }
        }));
    };

    const car = formData.Car;

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return (
                    <EstimateTab
                        data={car.EstimateDetails}
                        onChange={newData => updateSection("EstimateDetails", newData)}
                    />
                );
            case 1:
                return (
                    <PurchasedTab
                        data={car.PurchaseDetails}
                        onChange={newData => updateSection("PurchaseDetails", newData)}
                    />
                );
            case 2:
                return (
                    <TransportTab
                        data={car.TransportDetails}
                        onChange={newData => updateSection("TransportDetails", newData)}
                    />
                );
            case 3:
                return (
                    <PartsTab
                        data={car.PartsDetails}
                        onChange={newData => updateSection("PartsDetails", newData)}
                    />
                );
            case 4:
                return (
                    <MechanicTab
                        data={car.MechanicDetails}
                        onChange={newData => updateSection("MechanicDetails", newData)}
                    />
                );
            case 5:
                return (
                    <BodyshopTab
                        data={car.BodyshopDetails}
                        onChange={newData => updateSection("BodyshopDetails", newData)}
                    />
                );
            case 6:
                return (
                    <DetailTab
                        data={car.MiscellaniousDetails}
                        onChange={newData => updateSection("MiscellaniousDetails", newData)}
                    />
                );
            case 7:
                return (
                    <SoldTab
                        data={car.saleDetails}
                        onChange={newData => updateSection("saleDetails", newData)}
                        invoiceSummary={car.InvoiceDetails}
                    />
                );

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
