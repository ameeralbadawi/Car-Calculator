import React from "react";
import {
  useUser,
  useAuth,
  RedirectToSignIn,
  PricingTable,
} from "@clerk/clerk-react";
import { Container, Typography, Box } from "@mui/material";

export default function Subscribe() {
  const { user } = useUser();
  const { getToken } = useAuth(); // 👈 getToken will get our Clerk session token

  if (!user) return <RedirectToSignIn />;

  const handleCheckout = async (priceId) => {
    try {
      const token = await getToken(); // 👈 fetch token from Clerk

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈 send token to backend
          },
          body: JSON.stringify({
            userId: user.id,
            priceId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create checkout session");

      const { url } = await res.json();
      window.location.href = url; // redirect to Stripe checkout
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#778899", fontWeight: "700" }}
      >
        Choose Your Billing Plan
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 5, color: "#555" }}>
        Select the subscription option that works best for your dealership.
      </Typography>

      <Box
        sx={{
          bgcolor: "#fafafa",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(119,136,153,0.12)",
          "& .cl-toggle": { fontSize: "1.25rem !important", fontWeight: 600 },
          "& .cl-toggle__option": { padding: "12px 28px !important" },
          "& .cl-toggle__option--checked": {
            backgroundColor: "#778899 !important",
            color: "#fff !important",
            borderRadius: "12px !important",
            boxShadow: "0 3px 10px rgba(119,136,153,0.4) !important",
          },
          "& .cl-toggle__option:not(.cl-toggle__option--checked):hover": {
            backgroundColor: "#f0f2f4 !important",
            color: "#778899 !important",
            cursor: "pointer",
          },
          "& .cl-pricing-table": {
            border: "none",
            boxShadow: "0 4px 15px rgba(119,136,153,0.1)",
            borderRadius: "10px",
          },
          "& .cl-plan": {
            border: "1px solid #d0d7de",
            borderRadius: "10px",
            padding: "24px",
            margin: "12px",
            boxShadow: "none",
          },
          "& .cl-planTitle": {
            fontWeight: 700,
            fontSize: "1.3rem",
            marginBottom: "12px",
            color: "#555",
          },
          "& .cl-planButton": { display: "none" },
          "& .cl-planDescription": {
            color: "#666",
            fontSize: "0.95rem",
            marginBottom: "20px",
          },
        }}
      >
        <PricingTable
          plan="standard"
          appearance={{
            baseTheme: "light",
            variables: {
              colorPrimary: "#778899",
              colorText: "#333",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              borderRadius: "10px",
              spacingUnit: "8px",
            },
          }}
          onPlanSelect={({ priceId }) => handleCheckout(priceId)}
        />
      </Box>
    </Container>
  );
}
