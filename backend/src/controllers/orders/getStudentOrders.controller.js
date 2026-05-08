import { Order, ClubProductPost } from "../../modules/index.js";
import { getFileUrl } from "../../services/s3.service.js";

const resolveUrl = async (img) => {
  if (!img) return img;
  let imgPath = img;
  if (typeof img === 'object' && img !== null) {
    if (img.url) imgPath = img.url;
    else return imgPath;
  }
  if (typeof imgPath !== 'string') return imgPath;
  if (imgPath.includes("X-Amz-Signature")) return imgPath;
  const s3Match = imgPath.match(/https?:\/\/[^/]+\.amazonaws\.com\/(.+)/);
  if (s3Match) {
    try { return await getFileUrl(s3Match[1]); } catch { return imgPath; }
  }
  if (!imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    try { return await getFileUrl(imgPath); } catch { return imgPath; }
  }
  return imgPath;
};

export const getStudentOrders = async (req, res) => {
  try {
    const studentId = req.params.userId || (req.user ? req.user.id : null);

    if (!studentId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch orders without problematic association
    const orders = await Order.findAll({
      where: { buyerId: studentId },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Manually join ClubProductPost data
    const productIds = [...new Set(orders.map((o) => o.itemId).filter((id) => id))];
    let productMap = {};
    if (productIds.length > 0) {
      const products = await ClubProductPost.findAll({
        where: { id: productIds },
        raw: true,
      });
      
      // Resolve images
      await Promise.all(products.map(async (p) => {
        if (p.images && Array.isArray(p.images) && p.images.length > 0) {
          p.images = await Promise.all(p.images.map(resolveUrl));
        }
        productMap[p.id] = p;
      }));
    }

    const formattedOrders = orders.map((o) => ({
      ...o,
      clubProduct: o.itemId ? productMap[o.itemId] || null : null,
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
