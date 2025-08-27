import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import axios from "axios";
import FormData from "form-data";

// Configuration
const API_BASE_URL = "http://192.168.200.40/be/api";
const LOGIN_CREDENTIALS = {
  username: "admin",
  password: "Admin@123",
};

interface CollectionUnit {
  _id: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  user: any;
}

class VirusFileSync {
  private authToken: string = "";
  private collectionUnits: CollectionUnit[] = [];

  // 1. Đọc path của thư mục chứa mã độc đầu vào từ terminal (user nhập)
  private async getVirusDirectoryPath(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Nhập đường dẫn thư mục chứa file mã độc: ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  // 2. Đăng nhập admin/Admin@123
  private async login(): Promise<void> {
    try {
      console.log("Đang đăng nhập...");
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        LOGIN_CREDENTIALS
      );
      this.authToken = response.data.access_token;
      console.log("Đăng nhập thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw new Error("Không thể đăng nhập");
    }
  }

  // 3. Gọi API lấy danh sách đơn vị thu thập
  private async getCollectionUnits(): Promise<void> {
    try {
      console.log("Đang lấy danh sách đơn vị thu thập...");
      const response = await axios.get(`${API_BASE_URL}/collection-units`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      this.collectionUnits = response.data;
      console.log(`Đã lấy được ${this.collectionUnits.length} đơn vị thu thập`);
      console.log(this.collectionUnits);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn vị thu thập:", error);
      throw new Error("Không thể lấy danh sách đơn vị thu thập");
    }
  }

  // 4. Đọc thư mục chứa các file mã độc
  private async getVirusFiles(directoryPath: string): Promise<string[]> {
    try {
      if (!fs.existsSync(directoryPath)) {
        throw new Error(`Thư mục không tồn tại: ${directoryPath}`);
      }

      const files = fs.readdirSync(directoryPath, { withFileTypes: true });
      const virusFiles = files
        .filter((file) => file.isFile())
        .filter((file) => !file.name.startsWith(".")) // Bỏ qua các file ẩn (bắt đầu bằng .)
        .map((file) => path.join(directoryPath, file.name));

      console.log(
        `Tìm thấy ${virusFiles.length} file trong thư mục (đã bỏ qua các file ẩn)`
      );
      return virusFiles;
    } catch (error) {
      console.error("Lỗi khi đọc thư mục:", error);
      throw error;
    }
  }

  // 5.1 Đơn vị thu thập lấy ngẫu nhiên trong danh sách ở bước 3
  private getRandomCollectionUnit(): { id: string; name: string } {
    if (this.collectionUnits.length === 0) {
      throw new Error("Không có đơn vị thu thập nào");
    }
    const randomIndex = Math.floor(Math.random() * this.collectionUnits.length);
    const selectedUnit = this.collectionUnits[randomIndex];
    return {
      id: selectedUnit._id,
      name: selectedUnit.name,
    };
  }

  // 5.2 Ngày tạo lấy ngẫu nhiên từ tháng 11/2018 đến nay
  private getRandomDate(): string {
    const startDate = new Date("2018-11-01");
    const endDate = new Date();
    const randomTime =
      startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime).toISOString();
  }

  // 5. Gọi API tạo malwares với form data
  private async createMalware(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);
      const formData = new FormData();

      // Thêm file vào form data
      formData.append("file", fs.createReadStream(filePath));

      // Lấy đơn vị thu thập ngẫu nhiên
      const selectedUnit = this.getRandomCollectionUnit();

      // Thêm các thông tin khác
      formData.append("sampleName", fileName);
      formData.append("collectionUnit", selectedUnit.id);
      formData.append("collectionDate", this.getRandomDate());
      formData.append(
        "description",
        `Mã độc được đồng bộ từ TA21 - ${selectedUnit.name}`
      );

      const response = await axios.post(`${API_BASE_URL}/malware`, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.authToken}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log(`✓ Đã tạo thành công: ${fileName}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `✗ Lỗi khi tạo ${path.basename(filePath)}:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  // 6. Xử lý để không bị nghẽn khi gọi API
  private async processFilesInBatches(
    files: string[],
    batchSize: number = 5,
    delay: number = 1000
  ): Promise<void> {
    console.log(
      `Bắt đầu xử lý ${files.length} file với batch size ${batchSize}...`
    );

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      console.log(
        `\nXử lý batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          files.length / batchSize
        )} (${batch.length} file)`
      );

      // Xử lý song song trong batch
      const promises = batch.map(async (filePath) => {
        try {
          await this.createMalware(filePath);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      });

      await Promise.allSettled(promises);

      // Delay giữa các batch để tránh quá tải server
      if (i + batchSize < files.length) {
        console.log(`Chờ ${delay}ms trước khi xử lý batch tiếp theo...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.log(`\n=== Kết quả ===`);
    console.log(`Thành công: ${successCount}`);
    console.log(`Lỗi: ${errorCount}`);
    console.log(`Tổng: ${files.length}`);
  }

  // Main execution flow
  async run(): Promise<void> {
    try {
      // 1. Đọc path từ terminal
      const virusDirectoryPath = await this.getVirusDirectoryPath();

      // 2. Đăng nhập
      await this.login();

      // 3. Lấy danh sách đơn vị thu thập
      await this.getCollectionUnits();

      if (this.collectionUnits.length === 0) {
        throw new Error(
          "Không tìm thấy đơn vị thu thập nào. Vui lòng tạo ít nhất một đơn vị thu thập trước."
        );
      }

      // 4. Đọc thư mục chứa file mã độc
      const virusFiles = await this.getVirusFiles(virusDirectoryPath);

      if (virusFiles.length === 0) {
        console.log("Không tìm thấy file nào trong thư mục.");
        return;
      }

      // 5 & 6. Xử lý file trong batch để tránh nghẽn
      await this.processFilesInBatches(virusFiles);

      console.log("\n🎉 Hoàn thành đồng bộ file mã độc!");
    } catch (error) {
      console.error("Lỗi trong quá trình thực thi:", error);
      process.exit(1);
    }
  }
}

// Chạy script
if (require.main === module) {
  const syncTool = new VirusFileSync();
  syncTool.run().catch(console.error);
}

export default VirusFileSync;
