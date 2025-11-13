"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../hooks/useAuth";
import { dataTTHApi } from "../../../lib/apiDataTTH";
import type { MonthlySummaryItem, MonthlySummaryResponse } from "../../../types/dataTTH";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const number = (v: number | undefined, digits = 2) =>
  typeof v === "number" && !Number.isNaN(v) ? v.toFixed(digits) : "-";

export default function ReportesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [data, setData] = useState<MonthlySummaryResponse["data"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchData = async (opts?: { start?: string; end?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (opts?.start) params.start_date = opts.start;
      if (opts?.end) params.end_date = opts.end;
      const resp = await dataTTHApi.getMonthlySummary(params);
      setData(resp.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "No se pudo cargar el resumen mensual.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const notas = data?.notas;
  const rows: MonthlySummaryItem[] = useMemo(() => data?.summary || [], [data]);

  if (authLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Resumen mensual de Temperatura y Humedad
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Valores asumidos en °C (no se aplicó conversión).
          </Typography>
        </Box>

        {/* Filtros de fecha */}
        <Box sx={{ width: { xs: '100%', md: '60%', lg: '40%' } }}>
          <Paper sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              label="Fecha inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Fecha fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <Button
              variant="contained"
              onClick={() => fetchData({ start: startDate || undefined, end: endDate || undefined })}
              disabled={loading}
            >
              Aplicar
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                fetchData();
              }}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Limpiar
            </Button>
          </Paper>
        </Box>

        {/* Notas destacadas */}
        <Box>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                  <Typography variant="body2">
                    <strong>Mes más caluroso:</strong> {notas?.mes_mas_caluroso?.mes ?? '—'} (Temperatura promedio = {number(notas?.mes_mas_caluroso?.valor)} {notas?.mes_mas_caluroso?.unidad ?? ''})
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#3b82f6" }} />
                  <Typography variant="body2">
                    <strong>Mes más húmedo:</strong> {notas?.mes_mas_humedo?.mes ?? '—'} (Humedad promedio = {number(notas?.mes_mas_humedo?.valor)} {notas?.mes_mas_humedo?.unidad ?? ''})
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#22c55e" }} />
                  <Typography variant="body2">
                    <strong>Mes menos propicio para procesos agrícolas:</strong> {notas?.mes_menos_propicio?.mes ?? '—'} (Índice = {number(notas?.mes_menos_propicio?.valor)})
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Tabla de datos mensuales */}
        <Box>
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Mes</strong></TableCell>
                    <TableCell align="right"><strong>Temperatura_promedio</strong></TableCell>
                    <TableCell align="right"><strong>Temperatura_max</strong></TableCell>
                    <TableCell align="right"><strong>Temperatura_min</strong></TableCell>
                    <TableCell align="right"><strong>Humedad_promedio</strong></TableCell>
                    <TableCell align="right"><strong>Humedad_max</strong></TableCell>
                    <TableCell align="right"><strong>Humedad_min</strong></TableCell>
                    <TableCell align="right"><strong>n</strong></TableCell>
                    <TableCell align="right"><strong>Indice</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                          <CircularProgress size={24} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="text.secondary">Sin resultados</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{row.mes}</TableCell>
                        <TableCell align="right">{number(row.temperatura_promedio)}</TableCell>
                        <TableCell align="right">{number(row.temperatura_max)}</TableCell>
                        <TableCell align="right">{number(row.temperatura_min)}</TableCell>
                        <TableCell align="right">{number(row.humedad_promedio)}</TableCell>
                        <TableCell align="right">{number(row.humedad_max)}</TableCell>
                        <TableCell align="right">{number(row.humedad_min)}</TableCell>
                        <TableCell align="right">{row.n}</TableCell>
                        <TableCell align="right">{number(row.indice)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
