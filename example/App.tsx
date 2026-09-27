import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImageUploader,
  pickImages,
  takePhoto,
  type ImageUploaderError,
  type SelectedImage,
} from '@creuto/react-native-image-uploader';

export default function App() {
  const [multiImages, setMultiImages] = useState<SelectedImage[]>([]);
  const [singleGalleryImage, setSingleGalleryImage] = useState<SelectedImage[]>([]);
  const [singleCameraImage, setSingleCameraImage] = useState<SelectedImage[]>([]);
  const [validatedImages, setValidatedImages] = useState<SelectedImage[]>([]);
  const [programmaticImages, setProgrammaticImages] = useState<SelectedImage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 10)]);
  };

  const handleProgrammaticPick = async () => {
    try {
      addLog('Triggered programmatic pickImages()...');
      const results = await pickImages({
        maxImages: 3,
        maxFileSize: 5 * 1024 * 1024,
        quality: 0.8,
      });
      setProgrammaticImages(results);
      addLog(`Programmatic pick success: ${results.length} image(s)`);
    } catch (err: any) {
      addLog(`Programmatic pick error: ${err.message || String(err)}`);
    }
  };

  const handleProgrammaticCamera = async () => {
    try {
      addLog('Triggered programmatic takePhoto()...');
      const photo = await takePhoto({ quality: 0.8 });
      if (photo) {
        setProgrammaticImages((prev) => [...prev, photo]);
        addLog(`Programmatic camera success: ${photo.name || photo.uri}`);
      }
    } catch (err: any) {
      addLog(`Programmatic camera error: ${err.message || String(err)}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badge}>PRODUCTION READY</Text>
          <Text style={styles.title}>@creuto/react-native-image-uploader</Text>
          <Text style={styles.subtitle}>
            Local image picking, camera capture, validation, previewing & preparation.
          </Text>
        </View>

        {/* Demo 1: Multiple Images + Reordering + Both Sources */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Multiple Images & Reordering</Text>
          <Text style={styles.cardDescription}>
            Gallery + Camera support. Max 5 images, 5MB limit, 80% compression quality.
          </Text>

          <ImageUploader
            images={multiImages}
            onChange={setMultiImages}
            maxImages={5}
            maxFileSize={5 * 1024 * 1024}
            compressionQuality={0.8}
            allowReorder
            source="both"
            onSelect={(selected) => addLog(`Selected ${selected.length} image(s)`)}
            onRemove={(img, idx) => addLog(`Removed image at index ${idx}`)}
            onError={(err: ImageUploaderError) => addLog(`Error [${err.code}]: ${err.message}`)}
            onPermissionDenied={(src) => addLog(`Permission denied for ${src}`)}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Selected Count: {multiImages.length} / 5
            </Text>
          </View>
        </View>

        {/* Demo 2: Single Image (Gallery Only) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Gallery Only (Single Image)</Text>
          <Text style={styles.cardDescription}>
            source="gallery", maxImages=1
          </Text>

          <ImageUploader
            images={singleGalleryImage}
            onChange={setSingleGalleryImage}
            source="gallery"
            maxImages={1}
            onSelect={(selected) => addLog(`Single gallery photo: ${selected[0]?.name}`)}
            onError={(err) => addLog(`Error: ${err.message}`)}
          />
        </View>

        {/* Demo 3: Single Image (Camera Only) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Camera Only (Single Photo)</Text>
          <Text style={styles.cardDescription}>
            source="camera", maxImages=1
          </Text>

          <ImageUploader
            images={singleCameraImage}
            onChange={setSingleCameraImage}
            source="camera"
            maxImages={1}
            onSelect={(selected) => addLog(`Camera photo captured: ${selected[0]?.name}`)}
            onError={(err) => addLog(`Camera Error: ${err.message}`)}
          />
        </View>

        {/* Demo 4: Type & Dimension Validation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>4. Type Validation (JPEG/PNG only)</Text>
          <Text style={styles.cardDescription}>
            allowedTypes: ['image/jpeg', 'image/png'], maxFileSize: 2MB
          </Text>

          <ImageUploader
            images={validatedImages}
            onChange={setValidatedImages}
            allowedTypes={['image/jpeg', 'image/png']}
            maxFileSize={2 * 1024 * 1024}
            maxWidth={3000}
            maxHeight={3000}
            onError={(err) => addLog(`Validation Failure: ${err.message}`)}
          />
        </View>

        {/* Demo 5: Programmatic Utility API */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>5. Programmatic API</Text>
          <Text style={styles.cardDescription}>
            Call pickImages() or takePhoto() programmatically without UI component.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleProgrammaticPick}>
              <Text style={styles.actionBtnText}>Pick Images API</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.cameraBtn]} onPress={handleProgrammaticCamera}>
              <Text style={styles.actionBtnText}>Take Photo API</Text>
            </TouchableOpacity>
          </View>

          {programmaticImages.length > 0 && (
            <View style={styles.resultList}>
              {programmaticImages.map((img, i) => (
                <Text key={i} style={styles.resultItem}>
                  {i + 1}. {img.name} ({( (img.size || 0) / 1024 ).toFixed(1)} KB)
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Activity & Event Log */}
        <View style={styles.card}>
          <View style={styles.logHeader}>
            <Text style={styles.cardTitle}>Event Logs</Text>
            <TouchableOpacity onPress={() => setLogs([])}>
              <Text style={styles.clearLogsText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {logs.length === 0 ? (
            <Text style={styles.emptyLog}>No events logged yet. Perform actions above.</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  infoBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cameraBtn: {
    backgroundColor: '#059669',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  resultList: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  resultItem: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearLogsText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  emptyLog: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  logText: {
    fontSize: 11,
    color: '#374151',
    fontFamily: 'Platform' === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
});
