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
            // case 0:
            //     return (
            //         <EstimateTab
            //             data={car.EstimateDetails}
            //             onChange={newData => updateSection("EstimateDetails", newData)}
            //         />
            //     );
            case 0:
                return (
                    <PurchasedTab
                        data={car.PurchaseDetails}
                        onChange={newData => updateSection("PurchaseDetails", newData)}
                    />
                );
            case 1:
                return (
                    <TransportTab
                        data={car.TransportDetails}
                        onChange={newData => updateSection("TransportDetails", newData)}
                    />
                );
            case 2:
                return (
                    <PartsTab
                        data={car.PartsDetails}
                        onChange={newData => updateSection("PartsDetails", newData)}
                    />
                );
            case 3:
                return (
                    <MechanicTab
                        data={car.MechanicDetails}
                        onChange={newData => updateSection("MechanicDetails", newData)}
                    />
                );
            case 4:
                return (
                    <BodyshopTab
                        data={car.BodyshopDetails}
                        onChange={newData => updateSection("BodyshopDetails", newData)}
                    />
                );
            case 5:
                return (
                    <DetailTab
                        data={car.MiscellaniousDetails}
                        onChange={newData => updateSection("MiscellaniousDetails", newData)}
                    />
                );
            case 6:
                return (
                    <SoldTab
                        data={car.saleDetails}
                        onChange={newData => updateSection("saleDetails", newData)}
                        invoiceSummary={car.InvoiceDetails}
                    />
                );

            case 7:
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
  indicatorColor="#778899"
  textColor="#778899"
  variant="scrollable"
  scrollButtons="auto"
  TabIndicatorProps={{
    style: {
      backgroundColor: "#778899", // Custom underline color
      height: "3px" // Optional: customize thickness
    }
  }}
>
  {[
    "PURCHASED",
    "TRANSPORT",
    "PARTS",
    "MECHANIC",
    "BODYSHOP",
    "MISC.",
    "SOLD",
    "INVOICE"
  ].map((label, index) => (
    <Tab
      key={label}
      label={label}
      sx={{
        color: selectedTab === index ? "#778899" : "#000",
        fontWeight: selectedTab === index ? "bold" : "normal",
        textTransform: "none"
      }}
    />
  ))}
</Tabs>

            <Box sx={{ mt: 2 }}>{renderTabContent()}</Box>
        </>
    );
};

export default InvoiceTabs;
