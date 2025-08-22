// ===================================
// KONFIGURASI SUPABASE
// ===================================
// GANTI dengan URL dan Key dari project Supabase Anda
const SUPABASE_URL = 'https://hfzzoxrhhcxhoobelakl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmenpveHJoaGN4aG9vYmVsYWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzY3MDAsImV4cCI6MjA3MTQ1MjcwMH0.LyHfioKEQ1FU7OGXnHlBeqflnnBXZWeZ-s2bM8Cbr2Y'

// Inisialisasi Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ===================================
// FUNGSI DATABASE UTAMA
// ===================================

/**
 * Mengambil semua aplikasi/game dari database
 * @param {string} category - 'app', 'game', atau null untuk semua
 * @param {number} limit - jumlah data yang diambil
 * @param {number} offset - offset untuk pagination
 */
async function getApplications(category = null, limit = 12, offset = 0) {
    try {
        let query = supabase
            .from('applications')
            .select('*')
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })
        
        if (category) {
            query = query.eq('category', category)
        }
        
        const { data, error } = await query
        
        if (error) {
            console.error('Error fetching applications:', error)
            return []
        }
        
        return data || []
    } catch (error) {
        console.error('Error in getApplications:', error)
        return []
    }
}

/**
 * Mencari aplikasi berdasarkan kata kunci
 * @param {string} searchTerm - kata kunci pencarian
 * @param {string} category - kategori filter
 */
async function searchApplications(searchTerm, category = null) {
    try {
        let query = supabase
            .from('applications')
            .select('*')
            .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false })
        
        if (category) {
            query = query.eq('category', category)
        }
        
        const { data, error } = await query
        
        if (error) {
            console.error('Error searching applications:', error)
            return []
        }
        
        return data || []
    } catch (error) {
        console.error('Error in searchApplications:', error)
        return []
    }
}

/**
 * Mengambil detail aplikasi berdasarkan ID
 * @param {number} id - ID aplikasi
 */
async function getApplicationById(id) {
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', id)
            .single()
        
        if (error) {
            console.error('Error fetching application detail:', error)
            return null
        }
        
        return data
    } catch (error) {
        console.error('Error in getApplicationById:', error)
        return null
    }
}

/**
 * Menghitung total aplikasi untuk pagination
 * @param {string} category - kategori filter
 */
async function getTotalApplications(category = null) {
    try {
        let query = supabase
            .from('applications')
            .select('id', { count: 'exact', head: true })
        
        if (category) {
            query = query.eq('category', category)
        }
        
        const { count, error } = await query
        
        if (error) {
            console.error('Error counting applications:', error)
            return 0
        }
        
        return count || 0
    } catch (error) {
        console.error('Error in getTotalApplications:', error)
        return 0
    }
}

// ===================================
// FUNGSI RENDER HTML
// ===================================

/**
 * Render aplikasi ke dalam gallery HTML
 * @param {Array} applications - array data aplikasi
 */
function renderApplications(applications) {
    const gallery = document.querySelector('.tm-gallery')
    
    // Jika tidak ada gallery (seperti di halaman admin), gunakan renderApplicationsForAdmin
    if (!gallery) {
        const adminContainer = document.getElementById('applicationsTable') || document.getElementById('applicationsTableBody') || document.getElementById('applicationsContainer')
        if (adminContainer) {
            renderAdminTable(applications, adminContainer)
            return
        }
        // Hanya tampilkan error jika benar-benar tidak ada container yang cocok
        if (document.body.classList.contains('admin-page') || window.location.pathname.includes('admin.html')) {
            console.warn('Admin page: No suitable container found for rendering applications')
        }
        return
    }
    
    if (!applications || applications.length === 0) {
        gallery.innerHTML = `
            <div class="col-12 text-center">
                <p class="tm-text-gray">Tidak ada aplikasi ditemukan.</p>
            </div>
        `
        return
    }
    
    gallery.innerHTML = applications.map(app => `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
            <figure class="effect-ming tm-video-item">
                <img src="${app.image_url || 'img/img-01.jpg'}" alt="${app.title}" class="img-fluid">
                <figcaption class="d-flex align-items-center justify-content-center">
                    <h2>${app.title}</h2>
                    <a href="detail.html?id=${app.id}" class="tm-text-primary">View more</a>
                </figcaption>
            </figure>
            <div class="d-flex justify-content-between tm-text-gray">
                <span class="tm-text-gray-light">${formatDate(app.created_at)}</span>
                <span class="tm-text-primary">${app.category === 'app' ? 'Aplikasi' : 'Game'}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="tm-text-gray">Rating: ${app.rating || 0}/5 ⭐</span>
                <span class="tm-text-primary font-weight-bold">${formatPrice(app.price)}</span>
            </div>
        </div>
    `).join('')
}

/**
 * Render detail aplikasi untuk halaman detail
 * @param {Object} app - data aplikasi
 */
function renderApplicationDetail(app) {
    if (!app) {
        document.body.innerHTML = '<div class="container mt-5"><h2>Aplikasi tidak ditemukan</h2></div>'
        return
    }
    
    const detailContainer = document.querySelector('.detail-container') || document.body
    
    detailContainer.innerHTML = `
        <div class="container mt-5">
            <div class="row">
                <div class="col-lg-6">
                    <img src="${app.detail_image_url || app.image_url || 'img/img-01.jpg'}" alt="${app.title}" class="img-fluid rounded">
                </div>
                <div class="col-lg-6">
                    <h1 class="tm-text-primary">${app.title}</h1>
                    <p class="tm-text-gray mb-3">${app.category === 'app' ? 'Aplikasi' : 'Game'}</p>
                    <div class="mb-3">
                        <span class="tm-text-gray">Rating: ${app.rating || 0}/5 ⭐</span>
                    </div>
                    <h3 class="tm-text-primary mb-3">${formatPrice(app.price)}</h3>
                    <p class="tm-text-gray-dark mb-4">${app.description || 'Deskripsi tidak tersedia.'}</p>
                    
                    <div class="d-flex gap-3">
                        ${app.demo_url ? `<a href="${app.demo_url}" target="_blank" class="btn btn-outline-primary">Demo App</a>` : ''}
                        <button class="btn btn-primary" onclick="orderApplication(${app.id})">Order Sekarang</button>
                    </div>
                    
                    <div class="mt-4">
                        <small class="tm-text-gray">Ditambahkan: ${formatDate(app.created_at)}</small>
                    </div>
                </div>
            </div>
        </div>
    `
}

// ===================================
// FUNGSI HELPER
// ===================================

/**
 * Format tanggal ke format Indonesia
 * @param {string} dateString - string tanggal
 */
function formatDate(dateString) {
    if (!dateString) return 'Tanggal tidak tersedia'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Format harga ke format Rupiah
 * @param {number} price - harga
 */
function formatPrice(price) {
    if (!price || price === 0) return 'Gratis'
    
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price)
}

/**
 * Fungsi untuk order aplikasi
 * @param {number} appId - ID aplikasi
 */
function orderApplication(appId) {
    // Redirect ke WhatsApp untuk order
    const message = `Halo, saya ingin order aplikasi dengan ID: ${appId}`
    const whatsappUrl = `https://wa.me/6283896113043?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
}

// ===================================
// INISIALISASI HALAMAN
// ===================================

/**
 * Load data saat halaman dimuat
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Cek apakah ini halaman detail
    const urlParams = new URLSearchParams(window.location.search)
    const appId = urlParams.get('id')
    
    if (appId) {
        // Halaman detail
        const app = await getApplicationById(parseInt(appId))
        renderApplicationDetail(app)
    } else {
        // Halaman utama
        const applications = await getApplications()
        renderApplications(applications)
        
        // Setup search functionality
        setupSearch()
        
        // Setup category filters
        setupCategoryFilters()
    }
})

/**
 * Setup fungsi search
 */
function setupSearch() {
    const searchForm = document.querySelector('.tm-search-form')
    const searchInput = document.querySelector('.tm-search-input')
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const searchTerm = searchInput.value.trim()
            
            if (searchTerm) {
                const results = await searchApplications(searchTerm)
                renderApplications(results)
            } else {
                const applications = await getApplications()
                renderApplications(applications)
            }
        })
    }
}

/**
 * Setup filter kategori
 */
function setupCategoryFilters() {
    // Setup dropdown filter kategori
    const categoryFilter = document.getElementById('categoryFilter')
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', async (e) => {
            const selectedCategory = e.target.value
            const category = selectedCategory === 'all' ? null : selectedCategory
            
            // Update page title
            const pageTitle = document.getElementById('pageTitle')
            if (pageTitle) {
                if (category === 'app') {
                    pageTitle.textContent = 'Latest Aplikasi'
                } else if (category === 'game') {
                    pageTitle.textContent = 'Latest Game'
                } else {
                    pageTitle.textContent = 'Latest Aplikasi'
                }
            }
            
            // Load applications based on category
            const applications = await getApplications(category)
            renderApplications(applications)
        })
    }
}

/**
 * Inisialisasi halaman dengan kategori tertentu
 * @param {string} category - 'app', 'game', atau null untuk semua
 */
async function initializeDatabase(category = null) {
    try {
        // Load applications based on category
        const applications = await getApplications(category)
        
        // Render applications
        const applicationsContainer = document.getElementById('applicationsContainer')
        if (applicationsContainer) {
            renderApplicationsToContainer(applications, applicationsContainer)
        } else {
            renderApplications(applications)
        }
        
        // Setup search with category filter
        setupSearchWithCategory(category)
        
        // Update page title based on category
        updatePageTitle(category)
        
    } catch (error) {
        console.error('Error initializing database:', error)
    }
}

/**
 * Render aplikasi ke container tertentu
 * @param {Array} applications - array data aplikasi
 * @param {Element} container - container element
 */
function renderApplicationsToContainer(applications, container) {
    if (!applications || applications.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="tm-text-gray">Tidak ada aplikasi ditemukan.</p>
            </div>
        `
        return
    }
    
    container.innerHTML = applications.map(app => `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
            <figure class="effect-ming tm-video-item">
                <img src="${app.image_url || 'img/img-01.jpg'}" alt="${app.title}" class="img-fluid">
                <figcaption class="d-flex align-items-center justify-content-center">
                    <h2>${app.title}</h2>
                    <a href="detail.html?id=${app.id}" class="tm-text-primary">View more</a>
                </figcaption>
            </figure>
            <div class="d-flex justify-content-between tm-text-gray">
                <span class="tm-text-gray-light">${formatDate(app.created_at)}</span>
                <span class="tm-text-primary">${app.category === 'app' ? 'Aplikasi' : 'Game'}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <span class="tm-text-gray">Rating: ${app.rating || 0}/5 ⭐</span>
                <span class="tm-text-primary font-weight-bold">${formatPrice(app.price)}</span>
            </div>
        </div>
    `).join('')
}

/**
 * Setup search dengan filter kategori
 * @param {string} category - kategori filter
 */
function setupSearchWithCategory(category) {
    const searchForm = document.getElementById('searchForm')
    const searchInput = document.getElementById('searchInput')
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const searchTerm = searchInput.value.trim()
            
            let results
            if (searchTerm) {
                results = await searchApplications(searchTerm, category)
            } else {
                results = await getApplications(category)
            }
            
            const applicationsContainer = document.getElementById('applicationsContainer')
            if (applicationsContainer) {
                renderApplicationsToContainer(results, applicationsContainer)
            } else {
                renderApplications(results)
            }
        })
    }
}

/**
 * Update page title berdasarkan kategori
 * @param {string} category - kategori
 */
function updatePageTitle(category) {
    const pageTitle = document.getElementById('pageTitle')
    if (pageTitle) {
        if (category === 'app') {
            pageTitle.textContent = 'Latest Aplikasi'
        } else if (category === 'game') {
            pageTitle.textContent = 'Latest Game'
        } else {
            pageTitle.textContent = 'Latest Aplikasi'
        }
    }
}

/**
 * ADMIN FUNCTIONS - CRUD Operations
 */

/**
 * Tambah aplikasi/game baru
 * @param {Object} appData - data aplikasi baru
 * @returns {Object} hasil insert
 */
async function addApplication(appData) {
    try {
        const { data, error } = await supabase
            .from('applications')
            .insert([
                {
                    title: appData.title,
                    description: appData.description,
                    category: appData.category,
                    price: appData.price,
                    rating: appData.rating || 0,
                    image_url: appData.image_url,
                    detail_image_url: appData.detail_image_url,
                    demo_url: appData.demo_url,
                    download_url: appData.download_url,
                    features: appData.features || [],
                    screenshots: appData.screenshots || [],
                    requirements: appData.requirements || appData.system_requirements,
                    developer: appData.developer,
                    version: appData.version || '1.0.0',
                    size_mb: appData.size || appData.size_mb
                }
            ])
            .select()
        
        if (error) throw error
        return { success: true, data: data[0] }
    } catch (error) {
        console.error('Error adding application:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update aplikasi/game existing
 * @param {number} id - ID aplikasi
 * @param {Object} appData - data aplikasi yang diupdate
 * @returns {Object} hasil update
 */
async function updateApplication(id, appData) {
    try {
        const { data, error } = await supabase
            .from('applications')
            .update({
                title: appData.title,
                description: appData.description,
                category: appData.category,
                price: appData.price,
                rating: appData.rating,
                image_url: appData.image_url,
                detail_image_url: appData.detail_image_url,
                demo_url: appData.demo_url,
                download_url: appData.download_url,
                features: appData.features,
                screenshots: appData.screenshots,
                requirements: appData.requirements || appData.system_requirements,
                developer: appData.developer,
                version: appData.version,
                size_mb: appData.size || appData.size_mb,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
        
        if (error) throw error
        return { success: true, data: data[0] }
    } catch (error) {
        console.error('Error updating application:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Hapus aplikasi/game
 * @param {number} id - ID aplikasi
 * @returns {Object} hasil delete
 */
async function deleteApplication(id) {
    try {
        console.log('Attempting to delete application with ID:', id)
        
        // First check if the application exists
        const { data: existingApp, error: checkError } = await supabase
            .from('applications')
            .select('id, title')
            .eq('id', id)
            .single()
        
        if (checkError) {
            console.error('Error checking application:', checkError)
            return { success: false, error: 'Aplikasi tidak ditemukan: ' + checkError.message }
        }
        
        if (!existingApp) {
            return { success: false, error: 'Aplikasi tidak ditemukan' }
        }
        
        console.log('Found application to delete:', existingApp.title)
        
        // Perform the delete operation
        const { data, error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id)
            .select()
        
        if (error) {
            console.error('Delete operation failed:', error)
            throw error
        }
        
        console.log('Delete operation successful:', data)
        return { success: true, deletedData: data }
    } catch (error) {
        console.error('Error deleting application:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get semua aplikasi untuk admin (dengan pagination)
 * @param {number} page - halaman
 * @param {number} limit - limit per halaman
 * @param {string} category - filter kategori
 * @returns {Object} data aplikasi dengan pagination info
 */
async function getApplicationsForAdmin(page = 1, limit = 10, category = null) {
    try {
        let query = supabase
            .from('applications')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
        
        if (category) {
            query = query.eq('category', category)
        }
        
        const offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)
        
        const { data, error, count } = await query
        
        if (error) throw error
        
        return {
            success: true,
            data: data || [],
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        }
    } catch (error) {
        console.error('Error getting applications for admin:', error)
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Render tabel admin untuk daftar aplikasi
 * @param {Array} applications - array data aplikasi
 * @param {Element} container - container element
 */
function renderAdminTable(applications, container) {
    if (!applications || applications.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <p class="mb-0">Tidak ada aplikasi ditemukan.</p>
            </div>
        `
        return
    }
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Gambar</th>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Rating</th>
                        <th>Developer</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>${app.id}</td>
                            <td>
                                <img src="${app.image_url || 'img/img-01.jpg'}" 
                                     alt="${app.title}" 
                                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                            </td>
                            <td>
                                <strong>${app.title}</strong><br>
                                <small class="text-muted">${app.description ? app.description.substring(0, 50) + '...' : ''}</small>
                            </td>
                            <td>
                                <span class="badge ${app.category === 'app' ? 'badge-primary' : 'badge-success'}">
                                    ${app.category === 'app' ? 'Aplikasi' : 'Game'}
                                </span>
                            </td>
                            <td>${formatPrice(app.price)}</td>
                            <td>${app.rating || 0}/5 ⭐</td>
                            <td>${app.developer || '-'}</td>
                            <td>${formatDate(app.created_at)}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-sm btn-outline-primary" onclick="editApplication(${app.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="confirmDeleteApplication(${app.id}, '${app.title}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `
}

/**
 * Render aplikasi untuk admin (terpisah dari gallery utama)
 * @param {Array} applications - array data aplikasi
 * @param {string} containerId - ID container element
 */
function renderApplicationsForAdmin(applications, containerId = 'applicationsTable') {
    const container = document.getElementById(containerId)
    if (!container) {
        console.error(`Container ${containerId} not found`)
        return
    }
    
    // Gunakan admin table rendering
    renderAdminTable(applications, container)
}

// Export fungsi untuk digunakan di file lain
window.PlayoraDB = {
    getApplications,
    searchApplications,
    getApplicationById,
    getTotalApplications,
    renderApplications,
    renderApplicationDetail,
    orderApplication,
    // Admin functions
    addApplication,
    updateApplication,
    deleteApplication,
    getApplicationsForAdmin,
    renderAdminTable,
    renderApplicationsForAdmin
}

// Export fungsi initializeDatabase ke global scope
window.initializeDatabase = initializeDatabase