// import Link from "next/link";
// import { Box, Typography, Paper } from "@mui/material";
// import Grid from "@mui/material/Grid2";

// const cards = [
//   { label: "Study", path: "/countries/study" },
//   { label: "Tourism", path: "/countries/tourism" },
//   { label: "Immigration", path: "/countries/immigration" },
// ];

// export default function CountriesPage() {
//   return (
//     <Box sx={{ width: "90%", mx: "auto", py: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={4}>
//         Select a Category
//       </Typography>
//       <Grid container spacing={3}>
//         {cards.map((card, index) => (
//           <Grid key={index} size={{ xs: 12, md: 4 }}>
//             <Link href={card.path}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   p: 4,
//                   textAlign: "center",
//                   borderRadius: 3,
//                   cursor: "pointer",
//                   transition: "0.3s",
//                   "&:hover": { boxShadow: 6 },
//                 }}
//               >
//                 <Typography variant="h5" fontWeight="medium">
//                   {card.label}
//                 </Typography>
//               </Paper>
//             </Link>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
// app/countries/page.tsx
