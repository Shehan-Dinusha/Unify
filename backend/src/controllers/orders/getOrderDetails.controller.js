import { Order, ClubProductPost, User, Transaction } from "../../modules/index.js";
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

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: ClubProductPost,
          as: "clubProduct", // From earlier associations
          attributes: ["id", "name", "description", "images", "price", "pickupNote"],
        },
        {
          model: User,
          as: "seller", // Association should be defined in modules/index.js
          attributes: ["id", "name", "email", "avatar"],
        },
        {
          model: Transaction,
          as: "transaction",
          attributes: ["id", "status", "amount", "createdAt"],
        }
      ],
    });

    const plainOrder = order.toJSON();
    if (plainOrder.clubProduct && Array.isArray(plainOrder.clubProduct.images) && plainOrder.clubProduct.images.length > 0) {
      plainOrder.clubProduct.images = await Promise.all(plainOrder.clubProduct.images.map(resolveUrl));
    }

    res.status(200).json({ success: true, order: plainOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
