// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-center').classList.toggle('active');
});

// Smooth Scroll for Scroll Links
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll Animations
const sections = document.querySelectorAll('.content');
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
sections.forEach(section => observer.observe(section));

// Mode Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const mode = button.getAttribute('data-mode');
    document.getElementById('personalized-form').style.display = mode === 'personalized' ? 'block' : 'none';
    document.getElementById('food-based-form').style.display = mode === 'food-based' ? 'block' : 'none';
    document.getElementById('direct-macro-form').style.display = mode === 'direct-macro' ? 'block' : 'none';
  });
});

// Chart Initialization
let personalizedChart = null;
let foodBasedChart = null;
let directMacroChart = null;

function createChart(canvasId, carbsPercent, proteinPercent, fatPercent, type = 'pie') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.error(`Canvas element ${canvasId} not found`);
    return null;
  }

  let chartInstance;
  if (canvasId === 'personalized-macro-chart') chartInstance = personalizedChart;
  else if (canvasId === 'food-based-macro-chart') chartInstance = foodBasedChart;
  else chartInstance = directMacroChart;

  if (chartInstance) {
    chartInstance.destroy();
  }

  try {
    chartInstance = new Chart(ctx, {
      type: type,
      data: {
        labels: ['Karbohidrat', 'Protein', 'Lemak'],
        datasets: [{
          data: [carbsPercent, proteinPercent, fatPercent],
          backgroundColor: ['#E4A7B5', '#8E7DBE', 'rgba(255, 255, 255, 0.8)'],
          borderColor: '#8E7DBE',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#FFFFFF', font: { family: 'Poppins', size: 14 } }
          },
          tooltip: {
            callbacks: { label: context => `${context.label}: ${context.parsed}%` }
          }
        },
        animation: { duration: 1000, easing: 'easeInOutQuad' }
      }
    });
    console.log(`Chart ${canvasId} created successfully`);
    if (canvasId === 'personalized-macro-chart') personalizedChart = chartInstance;
    else if (canvasId === 'food-based-macro-chart') foodBasedChart = chartInstance;
    else directMacroChart = chartInstance;
    return chartInstance;
  } catch (error) {
    console.error(`Error creating chart ${canvasId}:`, error);
    return null;
  }
}

// Unit Converter
function convertUnits(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'cm' && toUnit === 'in') return (value / 2.54).toFixed(1);
  if (fromUnit === 'in' && toUnit === 'cm') return (value * 2.54).toFixed(1);
  if (fromUnit === 'kg' && toUnit === 'lbs') return (value * 2.20462).toFixed(1);
  if (fromUnit === 'lbs' && toUnit === 'kg') return (value / 2.20462).toFixed(1);
  return value;
}

// Food Data (per 100g, sourced from TkPI Kemenkes RI, USDA, ASEAN Food Composition Database)
const foodData = {
  white_rice: { carbs: 28.7, protein: 2.7, fat: 0.3, suggestion: 'Ganti dengan nasi merah atau quinoa untuk serat lebih.' },
  chicken_breast: { carbs: 0, protein: 31, fat: 3.6, suggestion: 'Kombinasikan dengan sayuran untuk diet rendah kalori.' },
  avocado: { carbs: 8.5, protein: 2, fat: 14.7, suggestion: 'Campur dengan tahu untuk protein tambahan.' },
  broccoli: { carbs: 7, protein: 2.8, fat: 0.4, suggestion: 'Tambah tempe untuk protein lengkap.' },
  salmon: { carbs: 0, protein: 25, fat: 13, suggestion: 'Ganti dengan ikan kembung untuk variasi lemak sehat.' },
  egg: { carbs: 0.7, protein: 12.6, fat: 9.5, suggestion: 'Kombinasikan dengan ubi jalar untuk karbohidrat kompleks.' },
  quinoa: { carbs: 21.3, protein: 4.4, fat: 1.9, suggestion: 'Tambah kacang merah untuk protein dan serat.' },
  tempe: { carbs: 9.1, protein: 20.3, fat: 8.8, suggestion: 'Kombinasikan dengan sayuran hijau untuk diet seimbang.' },
  tahu: { carbs: 2.7, protein: 10.9, fat: 5.8, suggestion: 'Goreng dengan minyak zaitun untuk lemak sehat.' },
  rendang_daging: { carbs: 4.5, protein: 19.7, fat: 28.2, suggestion: 'Konsumsi dalam porsi kecil karena tinggi lemak.' },
  soto_ayam: { carbs: 3.2, protein: 12.5, fat: 6.7, suggestion: 'Tambah sayuran untuk meningkatkan serat.' },
  nasi_goreng: { carbs: 31.2, protein: 6.5, fat: 10.8, suggestion: 'Gunakan minyak lebih sedikit untuk rendah lemak.' },
  ubi_jalar: { carbs: 20.1, protein: 1.6, fat: 0.1, suggestion: 'Kombinasikan dengan telur untuk protein.' },
  pisang: { carbs: 22.8, protein: 1.1, fat: 0.3, suggestion: 'Makan dengan kacang untuk protein tambahan.' }
};

// Custom Foods Array
let customFoods = [];

// Input Validation
function validateInput(value, type, minValue = 0) {
  if (type === 'string') return value.trim().length > 0;
  if (type === 'number') return !isNaN(value) && value >= minValue;
  if (type === 'select') return value !== '';
  return false;
}

// Update Food Dropdowns
function updateFoodDropdowns() {
  const selects = document.querySelectorAll('.food-select');
  selects.forEach(select => {
    const currentValue = select.value;
    select.innerHTML = `
      <option value="" disabled ${!currentValue ? 'selected' : ''}>Pilih makanan</option>
      ${Object.keys(foodData).map(key => `
        <option value="${key}" ${currentValue === key ? 'selected' : ''}>${key.replace('_', ' ').toUpperCase()}</option>
      `).join('')}
      ${customFoods.map(food => `
        <option value="custom_${food.name.toLowerCase().replace(/\s+/g, '_')}" ${currentValue === `custom_${food.name.toLowerCase().replace(/\s+/g, '_')}` ? 'selected' : ''}>${food.name} (Kustom)</option>
      `).join('')}
    `;
  });
}

// Custom Food Modal
const customFoodModal = document.getElementById('custom-food-modal');
document.querySelector('.custom-food-btn').addEventListener('click', () => {
  customFoodModal.style.display = 'flex';
});
document.querySelector('.close-modal').addEventListener('click', () => {
  customFoodModal.style.display = 'none';
  document.getElementById('custom-food-form').reset();
});
document.getElementById('custom-food-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('custom-food-name').value.trim();
  const carbs = parseFloat(document.getElementById('custom-carbs').value);
  const protein = parseFloat(document.getElementById('custom-protein').value);
  const fat = parseFloat(document.getElementById('custom-fat').value);

  if (!validateInput(name, 'string') ||
      !validateInput(carbs, 'number', 0) ||
      !validateInput(protein, 'number', 0) ||
      !validateInput(fat, 'number', 0)) {
    alert('Masukkan nama makanan dan nilai makronutrien yang valid (non-negatif).');
    return;
  }

  customFoods.push({ name, carbs, protein, fat, suggestion: 'Kombinasikan dengan makanan utuh untuk diet seimbang.' });
  updateFoodDropdowns();
  customFoodModal.style.display = 'none';
  document.getElementById('custom-food-form').reset();
  console.log('Custom food added:', { name, carbs, protein, fat });
});

// Add/Remove Food Inputs
document.querySelector('.add-food-btn').addEventListener('click', () => {
  const container = document.querySelector('#macro-form-food-based .form-group');
  const newInput = document.createElement('div');
  newInput.className = 'food-input-group';
  newInput.innerHTML = `
    <select class="food-select" name="food[]" required>
      <option value="" disabled selected>Pilih makanan</option>
      ${Object.keys(foodData).map(key => `<option value="${key}">${key.replace('_', ' ').toUpperCase()}</option>`).join('')}
      ${customFoods.map(food => `<option value="custom_${food.name.toLowerCase().replace(/\s+/g, '_')}">${food.name} (Kustom)</option>`).join('')}
    </select>
    <input type="number" class="food-weight" name="weight[]" placeholder="Berat (gram)" min="0" step="0.1" required>
    <button type="button" class="remove-food-btn"><i class="fas fa-trash"></i></button>
  `;
  container.insertBefore(newInput, document.querySelector('.add-food-btn'));
});

document.getElementById('macro-form-food-based').addEventListener('click', (e) => {
  if (e.target.closest('.remove-food-btn')) {
    const foodInputs = document.querySelectorAll('.food-input-group');
    if (foodInputs.length > 1) {
      e.target.closest('.food-input-group').remove();
    }
  }
});

// Personalized Calculator
document.getElementById('macro-form-personalized').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const gender = document.querySelector('input[name="gender"]:checked').value;
  let height = parseFloat(document.getElementById('height').value);
  const heightUnit = document.getElementById('height-unit').value;
  let weight = parseFloat(document.getElementById('weight').value);
  const weightUnit = document.getElementById('weight-unit').value;
  const activity = document.getElementById('activity').value;
  const goal = document.getElementById('goal').value;

  // Validation
  if (!validateInput(name, 'string') ||
      !validateInput(age, 'number', 1) ||
      !validateInput(height, 'number', 0) ||
      !validateInput(weight, 'number', 0) ||
      !validateInput(activity, 'select') ||
      !validateInput(goal, 'select')) {
    alert('Masukkan data yang valid: semua kolom harus diisi dengan nilai yang sesuai.');
    return;
  }

  // Convert units to metric
  height = convertUnits(height, heightUnit, 'cm');
  weight = convertUnits(weight, weightUnit, 'kg');

  // Harris-Benedict BMR
  let bmr;
  try {
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  } catch (error) {
    console.error('Error calculating BMR:', error);
    alert('Terjadi kesalahan dalam perhitungan BMR.');
    return;
  }

  // Activity Multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9
  };
  const tdee = (bmr * activityMultipliers[activity]).toFixed(1);

  // Macronutrient Ratios
  const ratios = {
    lose: { carbs: 40, protein: 30, fat: 30 },
    maintain: { carbs: 50, protein: 25, fat: 25 },
    gain: { carbs: 45, protein: 30, fat: 25 }
  };
  const { carbs, protein, fat } = ratios[goal];

  // Calculate Macronutrients
  const carbsGrams = ((tdee * (carbs / 100)) / 4).toFixed(1);
  const proteinGrams = ((tdee * (protein / 100)) / 4).toFixed(1);
  const fatGrams = ((tdee * (fat / 100)) / 9).toFixed(1);
  const carbsKcal = (carbsGrams * 4).toFixed(1);
  const proteinKcal = (proteinGrams * 4).toFixed(1);
  const fatKcal = (fatGrams * 9).toFixed(1);

  // Evidence-Based Tips
  const tips = {
    lose: `Fokus pada makanan rendah kalori seperti sayuran hijau dan kurangi karbohidrat olahan. Protein tinggi (${proteinGrams} g) membantu menjaga massa otot selama defisit kalori. Menurut WHO, konsumsi kalori harian harus 10-15% di bawah TDEE untuk penurunan berat badan yang sehat (WHO, 2004).`,
    maintain: `Jaga keseimbangan karbohidrat (${carbsGrams} g), protein (${proteinGrams} g), dan lemak (${fatGrams} g) dengan sumber gizi utuh seperti biji-bijian, daging tanpa lemak, dan lemak sehat. AKG Kemenkes RI (2019) merekomendasikan 55-65% karbohidrat untuk diet seimbang.`,
    gain: `Tingkatkan asupan protein (${proteinGrams} g, idealnya 1.6-2.2 g/kg berat badan) dan karbohidrat kompleks untuk mendukung pertumbuhan otot. Konsumsi kalori surplus 10-20% di atas TDEE dianjurkan (American College of Sports Medicine, 2018).`
  };

  // Display Results
  const resultText = `
    <p><strong>Nama:</strong> ${name}</p>
    <p><strong>TDEE:</strong> ${tdee} kkal</p>
    <p><strong>Rasio Makronutrien:</strong> ${carbs}% Karbohidrat, ${protein}% Protein, ${fat}% Lemak</p>
    <p><strong>Karbohidrat:</strong> ${carbsGrams} gram (${carbsKcal} kkal)</p>
    <p><strong>Protein:</strong> ${proteinGrams} gram (${proteinKcal} kkal)</p>
    <p><strong>Lemak:</strong> ${fatGrams} gram (${fatKcal} kkal)</p>
  `;
  document.getElementById('personalized-result-text').innerHTML = resultText;
  document.getElementById('personalized-tips').innerHTML = `<h4>Rekomendasi Diet:</h4><p>${tips[goal]}</p>`;
  personalizedChart = createChart('personalized-macro-chart', carbs, protein, fat);
  document.getElementById('personalized-result').style.display = 'block';

  // Save to History
  const historyTable = document.querySelector('#personalized-history tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${name}</td>
    <td>${tdee}</td>
    <td>${carbsGrams}</td>
    <td>${proteinGrams}</td>
    <td>${fatGrams}</td>
    <td>${new Date().toLocaleString()}</td>
  `;
  historyTable.insertBefore(row, historyTable.firstChild);

  // Export Functions
  document.getElementById('export-personalized-pdf').onclick = () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(12);
      doc.text(`Estimasi Makronutrien - ${name}`, 20, 20);
      doc.text(`TDEE: ${tdee} kkal`, 20, 30);
      doc.text(`Rasio: ${carbs}% Carbs, ${protein}% Protein, ${fat}% Fat`, 20, 40);
      doc.text(`Karbohidrat: ${carbsGrams} g (${carbsKcal} kkal)`, 20, 50);
      doc.text(`Protein: ${proteinGrams} g (${proteinKcal} kkal)`, 20, 60);
      doc.text(`Lemak: ${fatGrams} g (${fatKcal} kkal)`, 20, 70);
      doc.text(`Rekomendasi: ${tips[goal]}`, 20, 80, { maxWidth: 160 });
      doc.save(`estimasi-makronutrien-${name}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF. Silakan coba lagi.');
    }
  };

  document.getElementById('export-personalized-csv').onclick = () => {
    try {
      const data = [{
        Name: name,
        TDEE: tdee,
        Carbs_g: carbsGrams,
        Carbs_kcal: carbsKcal,
        Protein_g: proteinGrams,
        Protein_kcal: proteinKcal,
        Fat_g: fatGrams,
        Fat_kcal: fatKcal,
        Ratio: `${carbs}-${protein}-${fat}`,
        Date: new Date().toLocaleString()
      }];
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `estimasi-makronutrien-${name}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Gagal mengekspor CSV. Silakan coba lagi.');
    }
  };

  document.getElementById('export-personalized-txt').onclick = () => {
    try {
      const textContent = `
Estimasi Makronutrien - ${name}
==============================
TDEE: ${tdee} kkal
Rasio Makronutrien: ${carbs}% Karbohidrat, ${protein}% Protein, ${fat}% Lemak
Karbohidrat: ${carbsGrams} g (${carbsKcal} kkal)
Protein: ${proteinGrams} g (${proteinKcal} kkal)
Lemak: ${fatGrams} g (${fatKcal} kkal)
Rekomendasi: ${tips[goal]}
Tanggal: ${new Date().toLocaleString()}
      `.trim();
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `estimasi-makronutrien-${name}.txt`;
      link.click();
    } catch (error) {
      console.error('Error exporting TXT:', error);
      alert('Gagal mengekspor TXT. Silakan coba lagi.');
    }
  };
});

// Food-Based Calculator
document.getElementById('macro-form-food-based').addEventListener('submit', (e) => {
  e.preventDefault();

  const foodInputs = document.querySelectorAll('.food-input-group');
  let totalCarbs = 0, totalProtein = 0, totalFat = 0, totalCalories = 0;
  const results = [];
  const suggestions = new Set();
  let validInputs = true;

  foodInputs.forEach(input => {
    const foodKey = input.querySelector('.food-select').value;
    const weight = parseFloat(input.querySelector('.food-weight').value);

    if (!validateInput(foodKey, 'select') || !validateInput(weight, 'number', 0)) {
      validInputs = false;
      return;
    }

    let data;
    let foodName;
    if (foodKey.startsWith('custom_')) {
      const customFoodName = foodKey.replace('custom_', '');
      data = customFoods.find(food => `custom_${food.name.toLowerCase().replace(/\s+/g, '_')}` === foodKey);
      foodName = data.name;
    } else {
      data = foodData[foodKey];
      foodName = foodKey.replace('_', ' ').toUpperCase();
    }

    if (!data) {
      validInputs = false;
      return;
    }

    const factor = weight / 100;
    const carbs = (data.carbs * factor).toFixed(1);
    const protein = (data.protein * factor).toFixed(1);
    const fat = (data.fat * factor).toFixed(1);
    const calories = ((carbs * 4) + (protein * 4) + (fat * 9)).toFixed(1);

    totalCarbs += parseFloat(carbs);
    totalProtein += parseFloat(protein);
    totalFat += parseFloat(fat);
    totalCalories += parseFloat(calories);

    results.push({ foodName, weight, carbs, protein, fat, calories });
    suggestions.add(data.suggestion);
  });

  if (!validInputs) {
    alert('Masukkan makanan dan berat yang valid.');
    return;
  }

  const totalCarbsKcal = (totalCarbs * 4).toFixed(1);
  const totalProteinKcal = (totalProtein * 4).toFixed(1);
  const totalFatKcal = (totalFat * 9).toFixed(1);
  const totalKcal = (parseFloat(totalCarbsKcal) + parseFloat(totalProteinKcal) + parseFloat(totalFatKcal)).toFixed(1);
  const carbsPercent = totalKcal > 0 ? ((totalCarbsKcal / totalKcal) * 100).toFixed(1) : 0;
  const proteinPercent = totalKcal > 0 ? ((totalProteinKcal / totalKcal) * 100).toFixed(1) : 0;
  const fatPercent = totalKcal > 0 ? ((totalFatKcal / totalKcal) * 100).toFixed(1) : 0;

  // Display Results
  const resultText = `
    <h4>Detail Makanan:</h4>
    ${results.map(item => `
      <p><strong>${item.foodName} (${item.weight} g):</strong></p>
      <p>Karbohidrat: ${item.carbs} g (${(item.carbs * 4).toFixed(1)} kkal)</p>
      <p>Protein: ${item.protein} g (${(item.protein * 4).toFixed(1)} kkal)</p>
      <p>Lemak: ${item.fat} g (${(item.fat * 9).toFixed(1)} kkal)</p>
      <p>Total Kalori: ${item.calories} kkal</p>
    `).join('')}
    <h4>Total:</h4>
    <p><strong>Karbohidrat:</strong> ${totalCarbs.toFixed(1)} g (${totalCarbsKcal} kkal, ${carbsPercent}%)</p>
    <p><strong>Protein:</strong> ${totalProtein.toFixed(1)} g (${totalProteinKcal} kkal, ${proteinPercent}%)</p>
    <p><strong>Lemak:</strong> ${totalFat.toFixed(1)} g (${totalFatKcal} kkal, ${fatPercent}%)</p>
    <p><strong>Total Kalori:</strong> ${totalKcal} kkal</p>
  `;
  document.getElementById('food-based-result-text').innerHTML = resultText;
  document.getElementById('food-based-suggestions').innerHTML = `
    <h4>Saran Konsumsi:</h4>
    <ul>${Array.from(suggestions).map(s => `<li>${s}</li>`).join('')}</ul>
  `;
  foodBasedChart = createChart('food-based-macro-chart', carbsPercent, proteinPercent, fatPercent);
  document.getElementById('food-based-result').style.display = 'block';

  // Save to History
  const historyTable = document.querySelector('#food-based-history tbody');
  results.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.foodName}</td>
      <td>${item.weight}</td>
      <td>${item.carbs}</td>
      <td>${item.protein}</td>
      <td>${item.fat}</td>
      <td>${item.calories}</td>
      <td>${new Date().toLocaleString()}</td>
    `;
    historyTable.insertBefore(row, historyTable.firstChild);
  });

  // Export Functions
  document.getElementById('export-food-based-pdf').onclick = () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(12);
      let y = 20;
      doc.text('Estimasi Makronutrien - Food-Based', 20, y);
      y += 10;
      results.forEach(item => {
        doc.text(`${item.foodName} (${item.weight} g):`, 20, y);
        y += 10;
        doc.text(`Karbohidrat: ${item.carbs} g (${(item.carbs * 4).toFixed(1)} kkal)`, 20, y);
        y += 10;
        doc.text(`Protein: ${item.protein} g (${(item.protein * 4).toFixed(1)} kkal)`, 20, y);
        y += 10;
        doc.text(`Lemak: ${item.fat} g (${(item.fat * 9).toFixed(1)} kkal)`, 20, y);
        y += 10;
        doc.text(`Total Kalori: ${item.calories} kkal`, 20, y);
        y += 10;
      });
      doc.text('Total:', 20, y);
      y += 10;
      doc.text(`Karbohidrat: ${totalCarbs.toFixed(1)} g (${totalCarbsKcal} kkal, ${carbsPercent}%)`, 20, y);
      y += 10;
      doc.text(`Protein: ${totalProtein.toFixed(1)} g (${totalProteinKcal} kkal, ${proteinPercent}%)`, 20, y);
      y += 10;
      doc.text(`Lemak: ${totalFat.toFixed(1)} g (${totalFatKcal} kkal, ${fatPercent}%)`, 20, y);
      y += 10;
      doc.text(`Total Kalori: ${totalKcal} kkal`, 20, y);
      y += 10;
      doc.text('Saran Konsumsi:', 20, y);
      Array.from(suggestions).forEach((s, i) => {
        y += 10;
        doc.text(`- ${s}`, 20, y, { maxWidth: 160 });
      });
      doc.save('estimasi-makronutrien-food-based.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF. Silakan coba lagi.');
    }
  };

  document.getElementById('export-food-based-csv').onclick = () => {
    try {
      const data = results.map(item => ({
        Food: item.foodName,
        Weight_g: item.weight,
        Carbs_g: item.carbs,
        Carbs_kcal: (item.carbs * 4).toFixed(1),
        Protein_g: item.protein,
        Protein_kcal: (item.protein * 4).toFixed(1),
        Fat_g: item.fat,
        Fat_kcal: (item.fat * 9).toFixed(1),
        Calories_kcal: item.calories,
        Date: new Date().toLocaleString()
      }));
      data.push({
        Food: 'Total',
        Weight_g: '',
        Carbs_g: totalCarbs.toFixed(1),
        Carbs_kcal: totalCarbsKcal,
        Protein_g: totalProtein.toFixed(1),
        Protein_kcal: totalProteinKcal,
        Fat_g: totalFat.toFixed(1),
        Fat_kcal: totalFatKcal,
        Calories_kcal: totalKcal,
        Date: new Date().toLocaleString()
      });
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'estimasi-makronutrien-food-based.csv';
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Gagal mengekspor CSV. Silakan coba lagi.');
    }
  };

  document.getElementById('export-food-based-txt').onclick = () => {
    try {
      const textContent = `
Estimasi Makronutrien - Food-Based
=================================
${results.map(item => `
${item.foodName} (${item.weight} g):
Karbohidrat: ${item.carbs} g (${(item.carbs * 4).toFixed(1)} kkal)
Protein: ${item.protein} g (${(item.protein * 4).toFixed(1)} kkal)
Lemak: ${item.fat} g (${(item.fat * 9).toFixed(1)} kkal)
Total Kalori: ${item.calories} kkal
`).join('\n')}
Total:
Karbohidrat: ${totalCarbs.toFixed(1)} g (${totalCarbsKcal} kkal, ${carbsPercent}%)
Protein: ${totalProtein.toFixed(1)} g (${totalProteinKcal} kkal, ${proteinPercent}%)
Lemak: ${totalFat.toFixed(1)} g (${totalFatKcal} kkal, ${fatPercent}%)
Total Kalori: ${totalKcal} kkal

Saran Konsumsi:
${Array.from(suggestions).map(s => `- ${s}`).join('\n')}
Tanggal: ${new Date().toLocaleString()}
      `.trim();
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'estimasi-makronutrien-food-based.txt';
      link.click();
    } catch (error) {
      console.error('Error exporting TXT:', error);
      alert('Gagal mengekspor TXT. Silakan coba lagi.');
    }
  };
});

// Direct Macronutrient Calculator
document.getElementById('macro-form-direct-macro').addEventListener('submit', (e) => {
  e.preventDefault();

  const carbs = parseFloat(document.getElementById('carbs').value);
  const protein = parseFloat(document.getElementById('protein').value);
  const fat = parseFloat(document.getElementById('fat').value);

  // Validation
  if (!validateInput(carbs, 'number', 0) ||
      !validateInput(protein, 'number', 0) ||
      !validateInput(fat, 'number', 0)) {
    alert('Masukkan nilai makronutrien yang valid (non-negatif).');
    return;
  }

  // Calculate Calories
  const carbsKcal = (carbs * 4).toFixed(1);
  const proteinKcal = (protein * 4).toFixed(1);
  const fatKcal = (fat * 9).toFixed(1);
  const totalKcal = (parseFloat(carbsKcal) + parseFloat(proteinKcal) + parseFloat(fatKcal)).toFixed(1);

  // Calculate Percentages
  const carbsPercent = totalKcal > 0 ? ((carbsKcal / totalKcal) * 100).toFixed(1) : 0;
  const proteinPercent = totalKcal > 0 ? ((proteinKcal / totalKcal) * 100).toFixed(1) : 0;
  const fatPercent = totalKcal > 0 ? ((fatKcal / totalKcal) * 100).toFixed(1) : 0;

  // Recommendations
  const recommendations = `
    <h4>Rekomendasi Rasio Makronutrien:</h4>
    <ul>
      <li><strong>Seimbang (50-30-20):</strong> Cocok untuk kesehatan umum. Karbohidrat 50%, Protein 30%, Lemak 20% (WHO, 2004).</li>
      <li><strong>Tinggi Protein (40-40-20):</strong> Ideal untuk pembentukan otot. Karbohidrat 40%, Protein 40%, Lemak 20% (ACSM, 2018).</li>
      <li><strong>Tinggi Karbohidrat (60-20-20):</strong> Sesuai untuk atlet daya tahan. Karbohidrat 60%, Protein 20%, Lemak 20% (ADA, 2020).</li>
    </ul>
    <p>Rasio Anda saat ini: ${carbsPercent}% Karbohidrat, ${proteinPercent}% Protein, ${fatPercent}% Lemak. Pastikan sesuai dengan tujuan diet Anda.</p>
  `;

  // Display Results
  const resultText = `
    <p><strong>Karbohidrat:</strong> ${carbs.toFixed(1)} g (${carbsKcal} kkal, ${carbsPercent}%)</p>
    <p><strong>Protein:</strong> ${protein.toFixed(1)} g (${proteinKcal} kkal, ${proteinPercent}%)</p>
    <p><strong>Lemak:</strong> ${fat.toFixed(1)} g (${fatKcal} kkal, ${fatPercent}%)</p>
    <p><strong>Total Kalori:</strong> ${totalKcal} kkal</p>
  `;
  document.getElementById('direct-macro-result-text').innerHTML = resultText;
  document.getElementById('direct-macro-recommendations').innerHTML = recommendations;
  directMacroChart = createChart('direct-macro-chart', carbsPercent, proteinPercent, fatPercent);
  document.getElementById('direct-macro-result').style.display = 'block';

  // Save to History
  const historyTable = document.querySelector('#direct-macro-history tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${carbs.toFixed(1)}</td>
    <td>${protein.toFixed(1)}</td>
    <td>${fat.toFixed(1)}</td>
    <td>${totalKcal}</td>
    <td>${new Date().toLocaleString()}</td>
  `;
  historyTable.insertBefore(row, historyTable.firstChild);

  // Export Functions
  document.getElementById('export-direct-macro-pdf').onclick = () => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFont('helvetica');
      doc.setFontSize(12);
      doc.text('Estimasi Makronutrien - Direct Macronutrient', 20, 20);
      doc.text(`Karbohidrat: ${carbs.toFixed(1)} g (${carbsKcal} kkal, ${carbsPercent}%)`, 20, 30);
      doc.text(`Protein: ${protein.toFixed(1)} g (${proteinKcal} kkal, ${proteinPercent}%)`, 20, 40);
      doc.text(`Lemak: ${fat.toFixed(1)} g (${fatKcal} kkal, ${fatPercent}%)`, 20, 50);
      doc.text(`Total Kalori: ${totalKcal} kkal`, 20, 60);
      doc.text('Rekomendasi Rasio:', 20, 70);
      doc.text('- Seimbang (50-30-20): Karbohidrat 50%, Protein 30%, Lemak 20% (WHO, 2004)', 20, 80, { maxWidth: 160 });
      doc.text('- Tinggi Protein (40-40-20): Karbohidrat 40%, Protein 40%, Lemak 20% (ACSM, 2018)', 20, 90, { maxWidth: 160 });
      doc.text('- Tinggi Karbohidrat (60-20-20): Karbohidrat 60%, Protein 20%, Lemak 20% (ADA, 2020)', 20, 100, { maxWidth: 160 });
      doc.save('estimasi-makronutrien-direct-macro.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF. Silakan coba lagi.');
    }
  };

  document.getElementById('export-direct-macro-csv').onclick = () => {
    try {
      const data = [{
        Carbs_g: carbs.toFixed(1),
        Carbs_kcal: carbsKcal,
        Carbs_percent: carbsPercent,
        Protein_g: protein.toFixed(1),
        Protein_kcal: proteinKcal,
        Protein_percent: proteinPercent,
        Fat_g: fat.toFixed(1),
        Fat_kcal: fatKcal,
        Fat_percent: fatPercent,
        Total_kcal: totalKcal,
        Date: new Date().toLocaleString()
      }];
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'estimasi-makronutrien-direct-macro.csv';
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Gagal mengekspor CSV. Silakan coba lagi.');
    }
  };

  document.getElementById('export-direct-macro-txt').onclick = () => {
    try {
      const textContent = `
Estimasi Makronutrien - Direct Macronutrient
==========================================
Karbohidrat: ${carbs.toFixed(1)} g (${carbsKcal} kkal, ${carbsPercent}%)
Protein: ${protein.toFixed(1)} g (${proteinKcal} kkal, ${proteinPercent}%)
Lemak: ${fat.toFixed(1)} g (${fatKcal} kkal, ${fatPercent}%)
Total Kalori: ${totalKcal} kkal

Rekomendasi Rasio:
- Seimbang (50-30-20): Karbohidrat 50%, Protein 30%, Lemak 20% (WHO, 2004)
- Tinggi Protein (40-40-20): Karbohidrat 40%, Protein 40%, Lemak 20% (ACSM, 2018)
- Tinggi Karbohidrat (60-20-20): Karbohidrat 60%, Protein 20%, Lemak 20% (ADA, 2020)
Tanggal: ${new Date().toLocaleString()}
      `.trim();
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'estimasi-makronutrien-direct-macro.txt';
      link.click();
    } catch (error) {
      console.error('Error exporting TXT:', error);
      alert('Gagal mengekspor TXT. Silakan coba lagi.');
    }
  };
});