import axios from "axios"
import { pool } from "../config/db.js"
import { createClient } from "./clientController.js"

const PROXMOX_API_URL = process.env.PROXMOX_API_URL || "http://127.0.0.1:8000"

// Función auxiliar para obtener el VMID
const getVmidFromId = async (id) => {
  const [vpsInfo] = await pool.query(
    "SELECT vmid FROM vps WHERE id = ?",
    [id]
  )

  if (vpsInfo.length === 0) {
    throw new Error("VPS no encontrado")
  }

  return vpsInfo[0].vmid
}

const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

export const getAllVps = async (req, res) => {
  try {
    const { role, id } = req.user

    // Obtenemos información básica de la base de datos
    let query = `
      SELECT vps.*, 
             clients.email as client,
             plans.name as plan,
             plans.cpu,
             plans.ram,
             plans.storage,
             vps.username,
             vps.password
      FROM vps 
      LEFT JOIN clients ON vps.client_id = clients.id
      LEFT JOIN plans ON vps.plan_id = plans.id`
                 
    if (role !== 'admin') {
      query += ` WHERE vps.client_id = ?`
    }

    const [vpsServers] = await pool.query(query, role !== 'admin' ? [id] : undefined)
    
    // Para cada VPS, obtenemos su estado actual y IP
    const serversWithStatus = await Promise.all(vpsServers.map(async (vps) => {
      try {
        const statusResponse = await axios.get(`${PROXMOX_API_URL}/api/vps/${vps.vmid}/status`)
        const ipResponse = await axios.get(`${PROXMOX_API_URL}/api/vps/${vps.vmid}/ip`)

        return {
          ...vps,
          status: statusResponse.data.status,
          ip: ipResponse.data.ip || "No disponible",
          uptime: statusResponse.data.uptime,
          cpuUsage: Math.round(statusResponse.data.cpu * 100, 2),
          ramUsage: Math.round((statusResponse.data.mem / 1073741824) / vps.ram * 100, 2),
          storageUsage: statusResponse.data.maxdisk / 1073741824,
          networkIn: statusResponse.data.netin,
          networkOut: statusResponse.data.netout
        }
      } catch (error) {
        console.error(`Error getting status for VPS ${vps.id}:`, error)
        
        // Si recibimos un 404 y el detalle indica que no está ejecutándose, la VM está apagada
        if (error.response?.status === 404 && error.response?.data?.detail?.includes('not running')) {
          return {
            ...vps,
            status: "stopped",
            ip: "No disponible",
            uptime: 0,
            cpuUsage: 0,
            ramUsage: 0,
            storageUsage: 0,
            networkIn: 0,
            networkOut: 0
          }
        }
        
        return {
          ...vps,
          status: "unknown",
          ip: "No disponible",
          uptime: 0,
          cpuUsage: 0,
          ramUsage: 0,
          storageUsage: 0,
          networkIn: 0,
          networkOut: 0
        }
      }
    }))

    res.json(serversWithStatus)
  } catch (error) {
    console.error("Error getting VPS:", error)
    res.status(500).json({ error: "Error obteniendo los VPS" })
  }
}

export const getVpsById = async (req, res) => {
  try {
    const { id } = req.params

    const [vpsInfo] = await pool.query(
      `
      SELECT 
        v.id, 
        v.vmid,
        v.name, 
        p.name AS plan, 
        p.cpu, 
        p.ram, 
        p.storage 
      FROM vps v
      JOIN plans p ON v.plan_id = p.id
      WHERE v.id = ?
      `,
      [id]
    )

    if (vpsInfo.length === 0) {
      return res.status(404).json({ error: "VPS no encontrado" })
    }

    const vps = vpsInfo[0]
    const response = await axios.get(`${PROXMOX_API_URL}/api/vps/${vps.vmid}/status`)
    const realTimeData = response.data

    const ipResponse = await axios.get(`${PROXMOX_API_URL}/api/vps/${vps.vmid}/ip`)
    const ipAddress = ipResponse.data.ip || "No disponible"

    res.json({
      id: vps.id,
      name: vps.name,
      status: realTimeData.status,
      ip: ipAddress,
      plan: vps.plan,
      cpu: vps.cpu,
      ram: vps.ram,
      storage: vps.storage,
      uptime: realTimeData.uptime,
      cpuUsage: Math.round(realTimeData.cpu * 100,2),
      ramUsage: Math.round((realTimeData.mem / 1073741824) / vps.ram * 100, 2),
      storageUsage: realTimeData.maxdisk / 1073741824,
      networkIn: realTimeData.network_in,
      networkOut: realTimeData.network_out,
    })
  } catch (error) {
    console.error("Error fetching VPS data:", error)
    res.status(500).json({ error: "Error al obtener los datos del VPS" })
  }
}

export const startVps = async (req, res) => {
  try {
    const { id } = req.params
    const vmid = await getVmidFromId(id)
    
    await axios.post(`${PROXMOX_API_URL}/api/vps/${vmid}/start`)
    res.json({ success: true, message: "VPS iniciado correctamente" })
  } catch (error) {
    console.error("Error starting VPS:", error)
    res.status(500).json({ error: error.message || "Error al iniciar el VPS" })
  }
}

export const stopVps = async (req, res) => {
  try {
    const { id } = req.params
    const vmid = await getVmidFromId(id)
    
    await axios.post(`${PROXMOX_API_URL}/api/vps/${vmid}/stop`)
    res.json({ success: true, message: "VPS detenido correctamente" })
  } catch (error) {
    console.error("Error stopping VPS:", error)
    res.status(500).json({ error: error.message || "Error al detener el VPS" })
  }
}

export const restartVps = async (req, res) => {
  try {
    const { id } = req.params
    const vmid = await getVmidFromId(id)
    
    await axios.post(`${PROXMOX_API_URL}/api/vps/${vmid}/restart`)
    res.json({ success: true, message: "VPS reiniciado correctamente" })
  } catch (error) {
    console.error("Error restarting VPS:", error)
    res.status(500).json({ error: error.message || "Error al reiniciar el VPS" })
  }
}

export const createVps = async (req, res) => {
  const { cpu, ram, disk, distro, plan_id } = req.body
  const clientId = req.user.id
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Verificar que el cliente tiene suficientes créditos
    const [planInfo] = await connection.query(
      "SELECT price FROM plans WHERE id = ?",
      [plan_id]
    );

    if (planInfo.length === 0) {
      throw new Error("Plan no encontrado");
    }

    const [clientInfo] = await connection.query(
      "SELECT credits FROM clients WHERE id = ? FOR UPDATE",
      [clientId]
    );

    if (clientInfo[0].credits < planInfo[0].price) {
      throw new Error(`Saldo insuficiente. Necesitas ${planInfo[0].price} créditos.`);
    }

    // Generar nombre y credenciales para el VPS
    const randomNum = Math.floor(Math.random() * 10000)
    const vmName = `VPS-${randomNum.toString().padStart(5, '0')}`
    const vpsPassword = generatePassword()

    // Crear el VPS en el backend de Proxmox
    const response = await axios.post(`${PROXMOX_API_URL}/api/vps/create`, {
      pool_name: `pool-${clientId}`,
      vm_name: vmName,
      cpu: cpu,
      ram: ram,
      disk: disk,
      distro: distro,
      password: vpsPassword
    })

    if (!response.data.success) {
      throw new Error(response.data.error || "Error al crear el VPS");
    }

    // Descontar créditos del cliente
    await connection.query(
      "UPDATE clients SET credits = credits - ? WHERE id = ?",
      [planInfo[0].price, clientId]
    );

    // Registrar el VPS en la base de datos con sus credenciales
    const [result] = await connection.query(
      "INSERT INTO vps (id, name, vmid, client_id, plan_id, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [vmName, vmName, response.data.vmid, clientId, plan_id, "user", vpsPassword]
    )

    await connection.commit()
    
    res.json({ 
      success: true, 
      vpsId: result.insertId,
      remainingCredits: clientInfo[0].credits - planInfo[0].price,
      vpsCredentials: {
        username: "user",
        password: vpsPassword
      }
    })
  } catch (error) {
    await connection.rollback()
    console.error("Error creating VPS:", error)
    res.status(500).json({ error: error.message || "Error al crear el VPS" })
  } finally {
    connection.release()
  }
}

export const getVpsStatus = async (req, res) => {
  try {
    const vmid = await getVmidFromId(req.params.id)
    const response = await axios.get(`${PROXMOX_API_URL}/api/vps/${vmid}/status`)
    
    // Formateamos los datos que necesita el frontend
    res.json({
      status: response.data.status,
      cpuUsage: Math.round(response.data.cpu * 100, 2),
      ramUsage: Math.round((response.data.mem / (1024 * 1024 * 1024)), 2),
      storageUsage: Math.round((response.data.maxdisk / (1024 * 1024 * 1024)), 2),
      networkIn: response.data.netin,
      networkOut: response.data.netout,
      uptime: response.data.uptime
    })
  } catch (error) {
    if (error.response?.status === 404 && error.response?.data?.detail?.includes('not running')) {
      res.json({ status: 'stopped' })
    } else {
      console.error("Error getting VPS status:", error)
      res.status(500).json({ error: "Error al obtener estado del VPS" })
    }
  }
}

export const getVpsIp = async (req, res) => {
  try {
    const { id } = req.params
    const vmid = await getVmidFromId(id)
    
    const response = await axios.get(`${PROXMOX_API_URL}/api/vps/${vmid}/ip`)
    
    if (response.status !== 200) {
      throw new Error("Error obteniendo la IP del VPS")
    }

    res.json(response.data)
  } catch (error) {
    console.error("Error getting VPS IP:", error)
    res.status(error.response?.status || 500).json({ 
      error: error.message || "Error al obtener la IP del VPS" 
    })
  }
}

export const assignClient = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { vpsId } = req.params;
    const { clientId } = req.body;

    await connection.beginTransaction();

    // Verificar que el VPS existe
    const [vps] = await connection.query(
      "SELECT * FROM vps WHERE id = ?",
      [vpsId]
    );

    if (vps.length === 0) {
      throw new Error("VPS no encontrado");
    }

    // Verificar que el cliente existe
    const [client] = await connection.query(
      "SELECT * FROM clients WHERE id = ?",
      [clientId]
    );

    if (client.length === 0) {
      throw new Error("Cliente no encontrado");
    }

    // Asignar cliente al VPS
    await connection.query(
      "UPDATE vps SET client_id = ? WHERE id = ?",
      [clientId, vpsId]
    );

    await connection.commit();
    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Error asignando cliente:", error);
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};