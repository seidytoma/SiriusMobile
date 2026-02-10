// scripts/benchmark_organizar_chamados.js
const { performance } = require('perf_hooks');

// Configuration
const NUM_CHAMADOS = 10000;
const NUM_SECTORS = 50;

// Mock Data
const generateMockData = () => {
  const idsSetores = Array.from({ length: NUM_SECTORS }, (_, i) => String(i + 1));

  const chamados = Array.from({ length: NUM_CHAMADOS }, (_, i) => {
    return {
      chamado_id: i,
      cc_id: Math.floor(Math.random() * (NUM_SECTORS + 10)) + 1, // Some sectors might not be in the list
      tecnico_nome: Math.random() > 0.5 ? 'My Name' : 'Other Name',
      usuario_id: Math.random() > 0.5 ? '1' : '2',
      chamado_status: Math.random() > 0.7 ? 'Em Atendimento' : 'Aberto',
      chamado_prioridade: Math.random() > 0.8 ? 'Crítica' : 'Normal',
      chamado_dataabertura: new Date().toISOString(),
      chamado_inicioatendimento: new Date().toISOString(),
    };
  });

  const currentUser = { id: 1, name: 'My Name' };

  return { idsSetores, chamados, currentUser };
};

// Current Implementation (Simulated)
const currentOrganizarChamados = (listaChamados, idsSetores, currentUser) => {
  if (!Array.isArray(listaChamados)) return;
  if (!currentUser) return;
  if (listaChamados.length > 0 && (!idsSetores || idsSetores.length === 0)) return;

  const myId = currentUser?.id ? String(currentUser.id) : '';
  const myName = currentUser?.name || '';

  const emAtendimentoPorMim = [];
  const pendentesMeuSetor = [];
  const pendentesOutros = [];

  listaChamados.forEach(c => {
    const tecnicoNome = c.tecnico_nome || '';
    const usuarioId = c.usuario_id ? String(c.usuario_id) : '';

    const isMyService = c.chamado_status === 'Em Atendimento' &&
      (usuarioId === myId || (myName && tecnicoNome === myName));

    // THIS IS THE LINE TO OPTIMIZE
    const isMySector = idsSetores.includes(String(c.cc_id));
    c.isMySector = isMySector;

    if (isMyService) emAtendimentoPorMim.push(c);
    else if (isMySector) pendentesMeuSetor.push(c);
    else pendentesOutros.push(c);
  });

  return { emAtendimentoPorMim, pendentesMeuSetor, pendentesOutros };
};

// Optimized Implementation (Simulated)
const optimizedOrganizarChamados = (listaChamados, idsSetores, currentUser) => {
  if (!Array.isArray(listaChamados)) return;
  if (!currentUser) return;
  if (listaChamados.length > 0 && (!idsSetores || idsSetores.length === 0)) return;

  const myId = currentUser?.id ? String(currentUser.id) : '';
  const myName = currentUser?.name || '';

  // OPTIMIZATION: Convert to Set
  const idsSetoresSet = new Set(idsSetores);

  const emAtendimentoPorMim = [];
  const pendentesMeuSetor = [];
  const pendentesOutros = [];

  listaChamados.forEach(c => {
    const tecnicoNome = c.tecnico_nome || '';
    const usuarioId = c.usuario_id ? String(c.usuario_id) : '';

    const isMyService = c.chamado_status === 'Em Atendimento' &&
      (usuarioId === myId || (myName && tecnicoNome === myName));

    // OPTIMIZATION: Check Set
    const isMySector = idsSetoresSet.has(String(c.cc_id));
    c.isMySector = isMySector;

    if (isMyService) emAtendimentoPorMim.push(c);
    else if (isMySector) pendentesMeuSetor.push(c);
    else pendentesOutros.push(c);
  });

  return { emAtendimentoPorMim, pendentesMeuSetor, pendentesOutros };
};

// Benchmark Runner
const runBenchmark = () => {
  const { idsSetores, chamados, currentUser } = generateMockData();

  console.log(`Running benchmark with ${NUM_CHAMADOS} tickets and ${NUM_SECTORS} sectors.`);

  // Warmup
  currentOrganizarChamados(chamados.slice(0, 100), idsSetores, currentUser);
  optimizedOrganizarChamados(chamados.slice(0, 100), idsSetores, currentUser);

  // Measure Current
  const startCurrent = performance.now();
  for (let i = 0; i < 1000; i++) { // Run multiple times for stability
      currentOrganizarChamados(chamados, idsSetores, currentUser);
  }
  const endCurrent = performance.now();
  const timeCurrent = endCurrent - startCurrent;

  // Measure Optimized
  const startOptimized = performance.now();
  for (let i = 0; i < 1000; i++) { // Run multiple times for stability
      optimizedOrganizarChamados(chamados, idsSetores, currentUser);
  }
  const endOptimized = performance.now();
  const timeOptimized = endOptimized - startOptimized;

  console.log('--- Results ---');
  console.log(`Current Implementation: ${timeCurrent.toFixed(2)} ms`);
  console.log(`Optimized Implementation: ${timeOptimized.toFixed(2)} ms`);
  console.log(`Improvement: ${((timeCurrent - timeOptimized) / timeCurrent * 100).toFixed(2)}%`);
};

runBenchmark();
